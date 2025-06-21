import { Model } from "set-piece";
import { FeatureModel } from ".";
import { RoleModel } from "../role";

export namespace EnrageModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class EnrageModel<
    P extends RoleModel = RoleModel,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends FeatureModel<
    P,
    E & EnrageModel.Event,
    S & EnrageModel.State,
    C & EnrageModel.Child,
    R & EnrageModel.Refer
> {
    constructor(props: EnrageModel['props'] & {
        state: S & FeatureModel.State,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}