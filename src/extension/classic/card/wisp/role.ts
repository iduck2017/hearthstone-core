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
                baseHealth: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}