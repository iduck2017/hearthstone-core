import { Model } from "set-piece";
import { FeatureModel, HeroModel, MinionCardModel, SpellEffectModel } from "../../..";
import { CardFeaturesModel } from "./card";
import { AbortEvent } from "../../../types/abort-event";
import { RoleModel } from "./hero";

export type SpellHooksOptions = {
    effects: Map<SpellEffectModel, Model[]>;
}

export class SpellCastEvent extends AbortEvent<{ options: SpellHooksOptions }> {
    public redirect(target: RoleModel) {
        this._detail.options.effects.forEach((value, key) => {
            value.forEach((item, index) => {
                if (item instanceof MinionCardModel) value[index] = target;
                if (item instanceof HeroModel) value[index] = target;
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
        const effects = this.child.effects.map(item => item.chunk).filter(Boolean);
        return {
            ...result,
            effects: effects.length ? effects : undefined,
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
        return this.origin.child.items;
    }
}