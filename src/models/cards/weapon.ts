import { Event, EventUtil, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { WeaponAttackModel } from "../rules/attack/weapon";
import { WeaponActionModel } from "../rules/action/weapon";
import { HeroModel } from "../heroes";
import { WeaponHooksEvent, WeaponHooksModel } from "../hooks/weapon";
import { RoleBattlecryModel } from "../hooks/battlecry/role";
import { WeaponDisposeModel } from "../rules/dispose/weapon";
import { TurnModel } from "../rules/turn";
import { WeaponDeployModel } from "../rules/deploy/weapon";
import { WeaponBattlecryModel } from "../hooks/battlecry/weapon";

export namespace WeaponCardProps {
    export type S = {};
    export type E = {
        onEquip: Event;
    };
    export type C = {
        readonly hooks: WeaponHooksModel;
        readonly attack: WeaponAttackModel;
        readonly action: WeaponActionModel;
        readonly deploy: WeaponDeployModel;
        readonly dispose: WeaponDisposeModel;
    };
    export type R = {};
}

export class WeaponCardModel<
    E extends Partial<WeaponCardProps.E & CardProps.E> & Props.E = {},
    S extends Partial<WeaponCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<WeaponCardProps.C & CardProps.C> & Props.C = {},
    R extends Partial<WeaponCardProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & WeaponCardProps.E,
    S & WeaponCardProps.S,
    C & WeaponCardProps.C,
    R & WeaponCardProps.R
> {
    constructor(loader: Method<WeaponCardModel['props'] & {
        state: S & WeaponCardProps.S & Omit<CardProps.S, 'isActive'>;
        child: C & Pick<WeaponCardProps.C, 'attack' | 'action'> & Pick<CardProps.C, 'cost'>;
        refer: R & WeaponCardProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    deploy: props.child.deploy ?? new WeaponDeployModel(),
                    dispose: props.child.dispose ?? new WeaponDisposeModel(),
                    hooks: props.child.hooks ?? new WeaponHooksModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

    // play
    public async play() {
        const event = await this.toPlay();
        if (!event) return;
        await this.doPlay(event);
        await this.event.onPlay(new Event({}));
    }

    protected async toPlay(): Promise<WeaponHooksEvent | undefined> {
        // status 
        if (!this.state.isActive) return;
        // battlecry
        const hooks = this.child.hooks;
        const battlecry = await WeaponBattlecryModel.toRun(hooks.child.battlecry);
        if (!battlecry) return;
        // event
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        return {
            battlecry
        };
    }

    protected async doPlay(event: WeaponHooksEvent) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.use(cost.state.current);
        const hand = player.child.hand;
        hand.use(this);
        const from = hand.refer.order.indexOf(this);
        await this.run(from, event)
        hand.del(this)
    }

    private async run(from: number, event: WeaponHooksEvent) {
        const player = this.route.player;
        if (!player) return;
        const signal = this.event.toRun(new Event({}));
        if (signal.isCancel) return;
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(from, ...params);
        }
        const board = player.child.board;
        if (!board) return;
        this.child.deploy.run(board);
    }

    
}