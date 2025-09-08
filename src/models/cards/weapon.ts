import { DebugUtil, Event, Format, LogLevel, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { WeaponAttackModel } from "../rules/weapon-attack";
import { DurabilityModel } from "../rules/durability";
import { CharacterModel } from "../characters";
import { WeaponHooksModel } from "../hooks/weapon";
import { BattlecryModel } from "../hooks/battlecry";
import { WeaponDisposeModel } from "../rules/dispose/weapon";

export type WeaponPlayEvent = {
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
    WeaponCardProps.E,
    WeaponCardProps.S,
    WeaponCardProps.C,
    WeaponCardProps.R
> {
    constructor(loader: Method<WeaponCardModel['props'] & {
        state: WeaponCardProps.S & Format.State<Omit<CardProps.S, 'isActive'>>;
        child: Omit<WeaponCardProps.C, 'hooks' | 'dispose'> & Pick<CardProps.C, 'cost'>;
        refer: WeaponCardProps.R;
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

}