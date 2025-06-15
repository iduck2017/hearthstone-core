import { RoleModel } from "@/common/role";
import { Props, StoreService } from "set-piece";

@StoreService.is('wisp-role')
export class WispRoleModel extends RoleModel {
    constructor(props: Props<
        RoleModel.State,
        RoleModel.Child,
        RoleModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}