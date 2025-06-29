import { RoleModel } from "../../role";

export class MageRoleModel extends RoleModel {
    constructor(props: MageRoleModel['props']) {    
        super({
            uuid: props.uuid,
            state: {
                attack: 0,
                health: 30,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}