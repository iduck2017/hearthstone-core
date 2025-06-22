import { Model } from "set-piece";
import { MinionCardModel } from "./card/minion";
import { RoleModel } from "./role";

export namespace MinionRoleModel {
    export type State = {}
    export type Event = {}
    export type Child = {}
    export type Refer = {}
}

export class MinionRoleModel<
    P extends MinionCardModel = MinionCardModel,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends RoleModel<
    P,
    E & MinionRoleModel.Event,
    S & MinionRoleModel.State,
    C & MinionRoleModel.Child,
    R & MinionRoleModel.Refer
> {
    constructor(props: MinionRoleModel['props'] & {
        state: S & Pick<RoleModel.State, 'attack' | 'health'>, 
        child: C, 
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}