import { Props } from "set-piece";
import { RoleModel } from "../../../../common/role";

export class MageRoleModel extends RoleModel {
    constructor(props: Props<
        RoleModel.State,
        RoleModel.Child,
        RoleModel.Refer
    >) {
        super({
            ...props,
            state: {
                attack: 0,
                baseHealth: 30,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}