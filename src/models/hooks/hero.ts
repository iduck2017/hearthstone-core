import { CardHooksModel } from "./card";
import { PoisonousModel } from "../entries/poisonous";
import { Loader } from "set-piece";
import { FeatureModel } from "../features";

export namespace HeroHooksProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
    };
    export type R = {};
    export type P = {};
}

export class HeroHooksModel extends CardHooksModel<
    HeroHooksProps.E,
    HeroHooksProps.S,
    HeroHooksProps.C,
    HeroHooksProps.R,
    HeroHooksProps.P
> {
    constructor(loader?: Loader<HeroHooksModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    poisonous: props.child?.poisonous ?? new PoisonousModel(() => ({ state: { isActive: false }})),
                    ...props.child 
                },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.draft.child.items;
    }
}