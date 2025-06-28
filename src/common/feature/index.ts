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
    E extends Partial<FeatureModel.Event> = {},
    S extends Partial<FeatureModel.State> = {},
    C extends Partial<FeatureModel.Child> & Model.Child = {},
    R extends Partial<FeatureModel.Refer> & Model.Refer = {}
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