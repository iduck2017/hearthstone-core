import { RoleModel } from "../../role";

export class WarriorRoleModel extends RoleModel {
    constructor(props: WarriorRoleModel['props']) {    
        super({
            uuid: props.uuid,
            state: {
                rawAttack: 2,
                rawHealth: 30,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}