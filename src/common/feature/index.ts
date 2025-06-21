import { Model } from "set-piece";

export namespace FeatureModel {
    export type Event = {}
    export type State = {
        name: string;
        desc: string;
    };
    export type Child = {};
    export type Refer = {};
}

export abstract class FeatureModel<
    P extends Model = Model,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<
    P,
    E & FeatureModel.Event,
    S & FeatureModel.State,
    C & FeatureModel.Child,
    R & FeatureModel.Refer
> {
    constructor(props: FeatureModel['props'] & {
        state: S & FeatureModel.State;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}