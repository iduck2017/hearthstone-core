import { Model } from "set-piece";

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
    constructor(props: SkillModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}