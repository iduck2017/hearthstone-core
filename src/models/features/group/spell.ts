import { Event, Model } from "set-piece";
import { FeatureModel, RoleModel, SpellEffectDecor, SpellEffectModel } from "../../..";
import { CardFeatsModel } from "./card";
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

export namespace SpellFeatsModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly effects: SpellEffectModel[];
    };
    export type R = {};
}

export class SpellFeatsModel extends CardFeatsModel<
    SpellFeatsModel.E,
    SpellFeatsModel.S,
    SpellFeatsModel.C,
    SpellFeatsModel.R
> {
    constructor(props?: SpellFeatsModel['props']) {
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