import { Event, Method, Model, Props, State } from "set-piece";
import { CardModel, CardProps } from ".";
import { EffectModel } from "../features/effect";
import { SpellPerformModel } from "../rules/perform/spell";
import { SpellFeatsModel, SpellHooksOptions } from "../features/spell";
import { SchoolType } from "../../types/card";
import { SpellEffectModel } from "../features/effect/spell";

export namespace SpellCardProps {
    export type S = {
        readonly schools: SchoolType[];
    };
    export type E = {};
    export type C = {
        readonly feats: SpellFeatsModel;
        readonly effects: SpellEffectModel[],
        readonly perform: SpellPerformModel;
    };
    export type R = {};
}

export class SpellCardModel<
    E extends Partial<SpellCardProps.E & CardProps.E> & Props.E = {},
    S extends Partial<SpellCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<SpellCardProps.C & CardProps.C> & Props.C = {},
    R extends Partial<SpellCardProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & SpellCardProps.E,
    S & SpellCardProps.S,
    C & SpellCardProps.C,
    R & SpellCardProps.R
> {
    constructor(loader: Method<SpellCardModel['props'] & {
        state: S & State<Omit<CardProps.S, 'isActive'> & SpellCardProps.S>;
        child: C & Pick<CardProps.C, 'cost'>
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    effects: [],
                    feats: props.child.feats ?? new SpellFeatsModel(),
                    perform: props.child.perform ?? new SpellPerformModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

}