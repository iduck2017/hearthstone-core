import { DebugUtil, Model, TranxUtil, Props, Event, Format, Loader, Method } from "set-piece";
import { BoardModel } from "../containers/board";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { MinionHooksModel } from "../hooks/minion";
import { CardModel, CardProps } from ".";
import { RaceType } from "../../types/card";
import { RoleFeaturesModel } from "../features/role";
import { RoleModel } from "../role";
import { BattlecryModel } from "../hooks/battlecry";
import { DisposeModel } from "../rules/dispose";
import { MinionDisposeModel } from "../rules/dispose/minion";
import { MinionDeployModel } from "../rules/deploy/minion";

export type MinionCardEvent = { 
    battlecry: Map<BattlecryModel, Model[]>;
    position: number;
}

export namespace MinionCardProps {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        onPlay: Event;
        onSummon: Event;
    };
    export type C = {
        readonly hooks: MinionHooksModel;
        readonly role: RoleModel;
        readonly deploy: MinionDeployModel;
        readonly dispose: MinionDisposeModel
    };
    export type P = {};
    export type R = {};
}

export abstract class MinionCardModel<
    E extends Partial<MinionCardProps.E & CardProps.E> & Props.E = {},
    S extends Partial<MinionCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<MinionCardProps.C & CardProps.C> & Props.C = {},
    R extends Partial<MinionCardProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & MinionCardProps.E, 
    S & MinionCardProps.S, 
    C & MinionCardProps.C,
    R & MinionCardProps.R
> {
    constructor(loader: Method<MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & Format.State<Omit<CardProps.S, 'isActive'> & MinionCardProps.S>;
        child: C & Pick<MinionCardProps.C, 'role'> & Pick<CardProps.C, 'cost'>;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    hooks: props.child.hooks ?? new MinionHooksModel(),
                    deploy: props.child.deploy ?? new MinionDeployModel(),
                    dispose: props.child.dispose ?? new MinionDisposeModel(),
                    ...props.child 
                },
                refer: { ...props.refer },
            }
        });
    }

    public async play() {
        const event = await this.toPlay();
        if (!event) return;
        await this.doPlay(event);
        await this.event.onPlay(new Event({}));
    }

    protected async doPlay(event: MinionCardEvent) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.use(cost.state.current);
        // summon
        const hand = player.child.hand;
        hand.use(this);
        // battlecry
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        // end
        const board = player.child.board;
        if (!board) return;
        this.child.deploy.run(board, event.position);
    }
    
    protected async toPlay(): Promise<MinionCardEvent | undefined> {
        // status 
        if (!this.state.isActive) return;
        // summon
        const position = await this.toSummon();
        if (position === undefined) return;
        // battlecry
        const event: MinionCardEvent = {
            battlecry: new Map(),
            position,
        };
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const selectors = item.toRun();
            // condition not match
            if (!selectors) continue;
            for (const item of selectors) {
                if (!item.options.length) return;
            }
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                // user cancel
                if (result === undefined) return;
                params.push(result);
            }
            event.battlecry.set(item, params);
        }
        // event
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        return event;
    }

    private async toSummon(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.minions.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options));
        return position;
    }
}