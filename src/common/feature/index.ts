import { Model, Props } from "set-piece";

export namespace FeatureModel {
    export type Event = {}
    export type State = {
        name: string;
        desc: string;
    };
    export type Child = {};
    export type Refer = {};
}

export abstract class FeatureModel extends Model<
    Model,
    FeatureModel.Event,
    FeatureModel.State,
    FeatureModel.Child,
    FeatureModel.Refer
> {
    constructor(props: Props<
        FeatureModel.State,
        FeatureModel.Child,
        FeatureModel.Refer
    > & {
        state: { 
            name: string;
            desc: string;
        };
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}