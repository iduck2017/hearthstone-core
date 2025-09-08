import { DebugUtil, Event, Format, LogLevel, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { WeaponAttackModel } from "../rules/weapon-attack";
import { DurabilityModel } from "../rules/durability";
import { CharacterModel } from "../characters";
import { WeaponHooksModel } from "../hooks/weapon";
import { BattlecryModel } from "../hooks/battlecry";

export type WeaponPlayEvent = {
    battlecry: Map<BattlecryModel, Model[]>;
}

export namespace WeaponProps {
    export type S = {};
    export type E = {
        onEquip: Event;
    };
    export type C = {
        readonly hooks: WeaponHooksModel;
        readonly attack: WeaponAttackModel;
        readonly durability: DurabilityModel;
    };
    export type R = {};
}

export class WeaponModel<
    E extends Partial<WeaponProps.E & CardProps.E> & Props.E = {},
    S extends Partial<WeaponProps.S & CardProps.S> & Props.S = {},
    C extends Partial<WeaponProps.C & CardProps.C> & Props.C = {},
    R extends Partial<WeaponProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    WeaponProps.E,
    WeaponProps.S,
    WeaponProps.C,
    WeaponProps.R
> {
    constructor(loader: Method<WeaponModel['props'] & {
        state: WeaponProps.S & Format.State<Omit<CardProps.S, 'isActive'>>;
        child: Omit<WeaponProps.C, 'hooks'> & Pick<CardProps.C, 'cost'>;
        refer: WeaponProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    hooks: props.child.hooks ?? new WeaponHooksModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

    // equip
    public async play() {
        if (!this.state.isActive) return;
        const player = this.route.player;
        if (!player) return;
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        const event: WeaponPlayEvent = {
            battlecry: new Map(),
        };
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        await this.doPlay(event);
        await this.event.onPlay(new Event({}));
    }

    protected async doPlay(event: WeaponPlayEvent) {
        const player = this.route.player;
        if (!player) return;
        const character = player.child.character;
        this.doEquip(character);
        this.event.onEquip(new Event({}));
    }

    @TranxUtil.span()
    private doEquip(character: CharacterModel) {
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(this);
        const weapon = character.child.weapon;
        if (weapon) character.del(weapon);
        character.add(this);
    }

    // dispose
    // public dispose() {
    //     this.doRemove();
    //     const hooks = this.child.hooks;
    //     const deathrattle = hooks.child.deathrattle;
    //     for (const item of deathrattle) item.run();
    // }

    // @TranxUtil.span()
    // private doRemove() {
    //     const player = this.route.player;
    //     if (!player) return;
    //     const character = player.child.character;
    //     character.del(this);
    //     const graveyard = player.child.graveyard;
    //     graveyard.add(this);
    // }

}