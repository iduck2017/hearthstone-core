import { Event, Format, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps, PlayEvent } from ".";
import { WeaponAttackModel } from "../rules/weapon-attack";
import { DurabilityModel } from "../rules/durability";
import { CharacterModel } from "../characters";

export namespace WeaponProps {
    export type S = {};
    export type E = {
        onEquip: Event;
    };
    export type C = {
        attack: WeaponAttackModel;
        durability: DurabilityModel;
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
        state: WeaponProps.S & Format.State<CardProps.S>;
        child: WeaponProps.C & Pick<CardProps.C, 'cost'>;
        refer: WeaponProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    // equip
    public async play() {
        if (!this.check()) return;
        const player = this.route.player;
        if (!player) return;
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        const event = await this.toPlay();
        if (!event) return;
        await this.doPlay(event);
        await this.event.onPlay(new Event({}));
    }

    protected async doPlay(event: PlayEvent) {
        const player = this.route.player;
        if (!player) return;
        const character = player.child.character;
        this.doEquip(character);
        await super.doPlay(event);
        this.event.onEquip(new Event({}));
    }

    @TranxUtil.span()
    private doEquip(character: CharacterModel) {
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(this);
        const weapon = character.child.weapon;
        if (weapon) character.add(weapon);
    }

    // dispose
    public dispose() {
        this.doRemove();
        super.dispose();
    }

    @TranxUtil.span()
    private doRemove() {
        const player = this.route.player;
        if (!player) return;
        const character = player.child.character;
        character.del(this);
        const graveyard = player.child.graveyard;
        graveyard.add(this);
    }
}