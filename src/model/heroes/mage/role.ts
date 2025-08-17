import { RoleModel } from "../../role";
import { AttackModel } from "../../role/attack";
import { HealthModel } from "../../role/health";

export class MageRoleModel extends RoleModel {
    constructor(props: MageRoleModel['props']) {    
        super({
            uuid: props.uuid,
            state: {
                rawAttack: 0,
                rawHealth: 30,
                ...props.state,
            },
            child: { 
                health: new HealthModel({ state: { origin: 30 } }),
                attack: new AttackModel({ state: { origin: 0 } }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}