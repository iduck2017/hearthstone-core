import { CardFeatsModel } from "./card";
import { PoisonousModel } from "../entries/poisonous";
import { Loader } from "set-piece";
import { FeatureModel } from ".";

export namespace HeroFeatsProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
    };
    export type R = {};
    export type P = {};
}

export class HeroFeatsModel extends CardFeatsModel<
    HeroFeatsProps.E,
    HeroFeatsProps.S,
    HeroFeatsProps.C,
    HeroFeatsProps.R,
    HeroFeatsProps.P
> {
    constructor(loader?: Loader<HeroFeatsModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                refer: { ...props.refer },
                child: { 
                    poisonous: props.child?.poisonous ?? new PoisonousModel(() => ({ state: { isActive: false }})),
                    ...props.child 
                },
                route: {},
            }
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.draft.child.items;
    }
}