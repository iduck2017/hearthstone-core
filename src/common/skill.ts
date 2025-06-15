import { Model, Props } from "set-piece";

export namespace SkillModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class SkillModel extends Model<
    Model,
    SkillModel.Event,
    SkillModel.State,
    SkillModel.Child,
    SkillModel.Refer
> {
    constructor(props: Props<
        SkillModel.State,
        SkillModel.Child,
        SkillModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}