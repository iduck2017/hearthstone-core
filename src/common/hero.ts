import { Model, Props } from "set-piece";
import { SkillModel } from "./skill";
import { MageRoleModel } from "../extension/classic/hero/mage/role";
import { RoleModel } from "./role";

export namespace HeroModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        readonly role: RoleModel;
        skill: SkillModel;
    };
    export type Refer = {};
}

export abstract class HeroModel extends Model< 
    Model,
    HeroModel.Event,
    HeroModel.State,
    HeroModel.Child,
    HeroModel.Refer
> {
    constructor(props: Props<
        HeroModel.State,
        HeroModel.Child,
        HeroModel.Refer
    > & {
        child: { 
            skill: SkillModel;
            role: RoleModel;
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