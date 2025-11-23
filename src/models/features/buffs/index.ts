import { Model } from "set-piece";
import { OperatorType } from "../../../types/operator";
import { WeaponCardModel } from "../../entities/cards/weapon";
import { MinionCardModel } from "../../entities/cards/minion";
import { HeroModel } from "../../entities/heroes";
import { SpellCardModel } from "../../entities/cards/spell";
import { CardModel } from "../../entities/cards";

export namespace BuffModel {
    export type E = {};
    export type S = {
        readonly offset: number;
        readonly type: OperatorType;
        isEnabled: boolean;
    };
    export type C = {
        readonly buffs: BuffModel[];
    }
    export type R = {};
}

export class BuffModel<
    E extends Partial<BuffModel.E> & Model.E = {},
    S extends Partial<BuffModel.S> & Model.S = {},
    C extends Partial<BuffModel.C> & Model.C = {},
    R extends Partial<BuffModel.R> & Model.R = {}
> extends Model<
    E & BuffModel.E,
    S & BuffModel.S,
    C & BuffModel.C,
    R & BuffModel.R
> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);   
        const role = minion ?? hero;
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel);
        const spell: SpellCardModel | undefined = result.items.find(item => item instanceof SpellCardModel);
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        return {
            ...result,
            role,
            weapon,
            spell,
            card,
            minion,
            hero,
        }
    }

    constructor(props: BuffModel['props'] & {
        uuid: string | undefined;
        state: S,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                offset: 0,
                type: OperatorType.ADD,
                isEnabled: true,
                ...props.state 
            },
            child: { 
                buffs: [], 
                ...props.child 
            },
            refer: { ...props.refer },
        })
    }

    public disable() {
        this.origin.state.isEnabled = false;
    }
}