import { Event, Loader, Model } from "set-piece";
import { EffectModel } from "./effect";
import { FeatureModel, RoleModel, SpellEffectModel } from "../..";
import { CardFeatsModel } from "./card";

export type SpellHooksOptions = {
    effects: Map<EffectModel, Model[]>;
}

export class SpellCastEvent extends Event<{ options: SpellHooksOptions }> {
    public redirect(role: RoleModel) {
        this._detail.options.effects.forEach((value, key) => {
            value.forEach((item, index) => {
                if (item instanceof RoleModel) value[index] = role;
            })
        })
    }
}

export namespace SpellFeatsProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly effects: SpellEffectModel[];
    };
    export type R = {};
    export type P = {};
}

export class SpellFeatsModel extends CardFeatsModel<
    SpellFeatsProps.E,
    SpellFeatsProps.S,
    SpellFeatsProps.C,
    SpellFeatsProps.R,
    SpellFeatsProps.P
> {
    constructor(loader?: Loader<SpellFeatsModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    effects: [],
                    ...props.child,
                },
                refer: { ...props.refer },
                route: {},
            }
        })
    }
    
    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.draft.child.items;
    }
}