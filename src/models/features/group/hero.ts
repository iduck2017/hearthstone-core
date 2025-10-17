import { CardFeaturesModel } from "./card";
import { PoisonousModel } from "../entries/poisonous";
import { FeatureModel } from "..";
import { Model } from "set-piece";

export namespace HeroFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
        readonly feats: FeatureModel[];
    };
    export type R = {};
}

export class HeroFeaturesModel extends Model<
    HeroFeaturesModel.E,
    HeroFeaturesModel.S,
    HeroFeaturesModel.C,
    HeroFeaturesModel.R
> {
    public get chunk() {
        return {
            poisonous: this.child.poisonous.chunk || undefined,
            feats: this.child.feats.map(item => item.chunk).filter(Boolean),
        }
    }

    constructor(props?: HeroFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            refer: { ...props?.refer },
            child: { 
                feats: props?.child?.feats ?? [],
                poisonous: props?.child?.poisonous ?? new PoisonousModel({ state: { isActive: false }}),
                ...props?.child 
            },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.origin.child.feats;
    }
}