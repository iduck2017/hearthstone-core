import { RoleModel } from "../../role";

export class WarriorRoleModel extends RoleModel {
    constructor(props: WarriorRoleModel['props']) {    
        super({
            ...props,
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