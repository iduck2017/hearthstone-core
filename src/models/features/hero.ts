import { CardFeatsModel } from "./card";
import { PoisonousModel } from "../entries/poisonous";
import { FeatureModel } from "../rules/feature";

export namespace HeroFeatsModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
    };
    export type R = {};
}

export class HeroFeatsModel extends CardFeatsModel<
    HeroFeatsModel.E,
    HeroFeatsModel.S,
    HeroFeatsModel.C,
    HeroFeatsModel.R
> {
    constructor(props?: HeroFeatsModel['props']) {
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