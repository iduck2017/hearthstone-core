import { Model, StoreUtil } from "set-piece";
import { FeatureModel } from ".";

namespace FeaturesProps {
    export type E = {};
    export type S = {};
    export type C = {
        items: FeatureModel[];
    };
    export type R = {};
}

@StoreUtil.is('features')
export class FeaturesModel extends Model<
    FeaturesProps.E,
    FeaturesProps.S,
    FeaturesProps.C,
    FeaturesProps.R
> {
    constructor(props: FeaturesModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                items: [],
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }

    public add(feature: FeatureModel) {
        this.draft.child.items.push(feature);
        return feature;
    }
}