import { MinionRoleModel } from "@/common/role/minion";
import { RoleModel } from "@/common/role";

export class AbusiveSergeantRoleModel extends MinionRoleModel {
    constructor(props: AbusiveSergeantRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 2,
                maxHealth: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}