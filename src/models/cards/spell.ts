import { Event, Method, Model, State } from "set-piece";
import { EffectModel } from "../rules/effect";
import { SpellPerformModel } from "../rules/perform/spell";
import { SpellFeatsModel, SpellHooksOptions } from "../features/spell";
import { SchoolType } from "../../types/card-enums";
import { SpellEffectModel } from "../rules/spell-effect";
import { CardModel } from ".";

export namespace SpellCardModel {
    export type S = {
        readonly schools: SchoolType[];
    };
    export type E = {};
    export type C = {
        readonly feats: SpellFeatsModel;
        readonly perform: SpellPerformModel;
    };
    export type R = {};
}

export class SpellCardModel<
    E extends Partial<SpellCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<SpellCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<SpellCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<SpellCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    E & SpellCardModel.E,
    S & SpellCardModel.S,
    C & SpellCardModel.C,
    R & SpellCardModel.R
> {
    constructor(props: SpellCardModel['props'] & {
        state: S & State<Omit<CardModel.S, 'isActive'> & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                feats: props.child.feats ?? new SpellFeatsModel(),
                perform: props.child.perform ?? new SpellPerformModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

}