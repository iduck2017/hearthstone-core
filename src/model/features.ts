import { Model } from "set-piece";
import { FeatureModel } from "./feature";

namespace FeaturesModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        items: FeatureModel[];
    };
    export type Refer = {};
}

export class FeaturesModel extends Model<
    FeaturesModel.Event,
    FeaturesModel.State,
    FeaturesModel.Child,
    FeaturesModel.Refer
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