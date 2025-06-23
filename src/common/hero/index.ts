import { Model } from "set-piece";
import { SkillModel } from "../skill";
import { RoleModel } from "../role";

export namespace HeroModel {
    export type Event = {};
    export type State = {
        readonly name: string;
    };
    export type Child = {
        readonly role: RoleModel;
        skill: SkillModel;
    };
    export type Refer = {};
}

export abstract class HeroModel<
    P extends Model = Model,
    E extends Partial<HeroModel.Event> & Model.Event = {},
    S extends Partial<HeroModel.State> & Model.State = {},
    C extends Partial<HeroModel.Child> & Model.Child = {},
    R extends Partial<HeroModel.Refer> & Model.Refer = {}
> extends Model< 
    P,
    E & HeroModel.Event,
    S & HeroModel.State,
    C & HeroModel.Child,
    R & HeroModel.Refer
> {
    constructor(props: HeroModel['props'] & {
        state: S & HeroModel.State;
        child: C & HeroModel.Child;
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