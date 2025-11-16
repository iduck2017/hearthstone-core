import { Decor, Model } from "set-piece";
import { FeatureModel, CardModel, SpellCardModel } from "../../..";
import { EffectModel } from "./effect";

export namespace SpellEffectModel {
    export type E = {};
    export type S = { damage: number[] };
    export type C = {};
    export type R = {};
}

export class SpellEffectDecor<S extends Model.S = {}> extends Decor<
    SpellEffectModel['origin']['state'] & S
> {
    public add(value: number) {
        this._origin.damage = this._origin.damage.map(item => item + value);
    }
}

export abstract class SpellEffectModel<
    T extends Model = Model,
    E extends Partial<SpellEffectModel.E> & Model.E = {},
    S extends Partial<SpellEffectModel.S> & Model.S = {},
    C extends Partial<SpellEffectModel.C> & Model.C = {},
    R extends Partial<SpellEffectModel.R> & Model.R = {},
> extends EffectModel<T,
    E & SpellEffectModel.E,
    S & SpellEffectModel.S,
    C & SpellEffectModel.C,
    R & SpellEffectModel.R
>{
    public get decor(): SpellEffectDecor<S> { return new SpellEffectDecor(this); }


    public get state() {
        const result = super.state;
        const damage = result.damage;
        let desc = result.desc;
        damage.forEach((item, index) => {
            const regexp = new RegExp(`{{spellDamage\\[${index}\\]}}`, 'g');
            desc = desc.replace(regexp, item.toString());
        })
        return { ...result, desc }
    }

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        const spell: SpellCardModel | undefined = result.items.find(item => item instanceof SpellCardModel);
        return {
            ...result,
            card,
            spell,
        }
    }


    constructor(props: SpellEffectModel['props'] & {
        child: C;
        state: S & SpellEffectModel.S & Pick<FeatureModel.S, 'desc' | 'name'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { 
                callers: [],
                ...props.refer 
            },
        })
    }
}