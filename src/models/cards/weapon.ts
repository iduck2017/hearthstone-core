import { Event, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { WeaponAttackModel } from "../rules/attack/attack";
import { DurabilityModel } from "../rules/durability";
import { HeroModel } from "../heroes";
import { WeaponHooksModel } from "../hooks/weapon";
import { BattlecryModel } from "../hooks/battlecry";
import { WeaponDisposeModel } from "../rules/dispose/weapon";
import { SelectUtil } from "../../utils/select";

export type WeaponCardEvent = {
    battlecry: Map<BattlecryModel, Model[]>;
}

export namespace WeaponCardProps {
    export type S = {};
    export type E = {
        onEquip: Event;
    };
    export type C = {
        readonly hooks: WeaponHooksModel;
        readonly attack: WeaponAttackModel;
        readonly durability: DurabilityModel;
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
        child: C & Omit<WeaponCardProps.C, 'hooks' | 'dispose'> & Pick<CardProps.C, 'cost'>;
        refer: R & WeaponCardProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
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

    protected async toPlay(): Promise<WeaponCardEvent | undefined> {
        // status 
        if (!this.state.isActive) return;
        // battlecry
        const event: WeaponCardEvent = {
            battlecry: new Map(),
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

    protected async doPlay(event: WeaponCardEvent) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.use(cost.state.current);
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
        // equip
        const hero = player.child.hero;
        this.equip(hero);
    }


    // equip
    public equip(hero: HeroModel) {
        this.doEquip(hero);
        this.event.onEquip(new Event({}))
    }

    @TranxUtil.span()
    private doEquip(hero: HeroModel) {
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        if (hand) hand.del(this);
        const prev = hero.child.weapon;
        if (prev) {
            prev.child.dispose.active({
                source: hero,
                detail: this,
            }, true);
            hero.del();
        }
        hero.add(this);
    }

}