import { Model } from "set-piece";

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
    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S;
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