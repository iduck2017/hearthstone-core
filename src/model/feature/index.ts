import { Callback, Model } from "set-piece";

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
    E extends Partial<FeatureModel.Event> & Model.Event = {},
    S extends Partial<FeatureModel.State> & Model.State = {},
    C extends Partial<FeatureModel.Child> & Model.Child = {},
    R extends Partial<FeatureModel.Refer> & Model.Refer = {}
> extends Model<
    E & FeatureModel.Event,
    S & FeatureModel.State,
    C & FeatureModel.Child,
    R & FeatureModel.Refer
> {
    static assign<T extends FeatureModel>(target: T[] | undefined, ...source: T[]) {
        const result = [...target ?? []];
        source.forEach(item => {
            if (!result.find(item => item instanceof item.constructor)) result.push(item);
        })
        return result;
    }

    protected abstract check(): boolean;

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
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