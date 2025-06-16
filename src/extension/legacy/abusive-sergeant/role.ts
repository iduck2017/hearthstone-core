import { RoleModel } from "@/common/role";
import { Props } from "set-piece";

export class AbusiveSergeantRoleModel extends RoleModel {
    constructor(props: Props<
        RoleModel.State,
        RoleModel.Child,
        RoleModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                attack: 2,
                baseHealth: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}