import { Event, Loader, Model } from "set-piece";
import { EffectModel } from "../features/effect";
import { FeatureModel, RoleModel } from "../..";
import { CardFeatsModel } from "./card";

export type SpellHooksOptions = {
    effect: Map<EffectModel, Model[]>;
}

export class SpellCastEvent extends Event<{ options: SpellHooksOptions }> {
    public redirect(role: RoleModel) {
        this._detail.options.effect.forEach((value, key) => {
            value.forEach((item, index) => {
                if (item instanceof RoleModel) value[index] = role;
            })
        })
    }
}

export namespace SpellFeatsProps {
    export type E = {};
    export type S = {};
    export type C = {};
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
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }
    
    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.draft.child.items;
    }
}