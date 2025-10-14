import { Event, Model } from "set-piece";
import { FeatureModel, RoleModel, SpellEffectDecor, SpellEffectModel } from "../../..";
import { CardFeaturesModel } from "./card";
import { AbortEvent } from "../../../types/abort-event";

export type SpellHooksOptions = {
    effects: Map<SpellEffectModel, Model[]>;
}

export class SpellCastEvent extends AbortEvent<{ options: SpellHooksOptions }> {
    public redirect(role: RoleModel) {
        this._detail.options.effects.forEach((value, key) => {
            value.forEach((item, index) => {
                if (item instanceof RoleModel) value[index] = role;
            })
        })
    }
}

export namespace SpellFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly effects: SpellEffectModel[];
    };
    export type R = {};
}

export class SpellFeaturesModel extends CardFeaturesModel<
    SpellFeaturesModel.E,
    SpellFeaturesModel.S,
    SpellFeaturesModel.C,
    SpellFeaturesModel.R
> {
    public get chunk() {
        const result = super.chunk;
        return {
            ...result,
            child: {
                ...result.child,
                effects: this.origin.child.effects.map(item => item.chunk),
            }
        }
    }

    constructor(props?: SpellFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { 
                effects: [],
                ...props?.child,
            },
            refer: { ...props?.refer },
        })
    }
    
    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.origin.child.feats;
    }
}