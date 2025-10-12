import { CardFeaturesModel } from "./card";
import { PoisonousModel } from "../entries/poisonous";
import { FeatureModel } from "..";

export namespace HeroFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
    };
    export type R = {};
}

export class HeroFeaturesModel extends CardFeaturesModel<
    HeroFeaturesModel.E,
    HeroFeaturesModel.S,
    HeroFeaturesModel.C,
    HeroFeaturesModel.R
> {
    constructor(props?: HeroFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            refer: { ...props?.refer },
            child: { 
                poisonous: props?.child?.poisonous ?? new PoisonousModel({ state: { isActive: false }}),
                ...props?.child 
            },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.origin.child.feats;
    }
}