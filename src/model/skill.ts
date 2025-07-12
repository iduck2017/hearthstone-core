import { Model, Props } from "set-piece";
import { HeroCardModel } from "./card/hero";

export namespace SkillModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class SkillModel<
    E extends Partial<SkillModel.Event> & Model.Event = {},
    S extends Partial<SkillModel.State> & Model.State = {},
    C extends Partial<SkillModel.Child> & Model.Child = {},
    R extends Partial<SkillModel.Refer> & Model.Refer = {},
> extends Model<
    E & SkillModel.Event,
    S & SkillModel.State,
    C & SkillModel.Child,
    R & SkillModel.Refer
> {
    constructor(props: SkillModel['props'] & Props<S, C, R>) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}