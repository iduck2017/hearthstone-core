import { RoleModel } from "../../role";
import { AttackModel } from "../../role/attack";
import { HealthModel } from "../../role/health";

export class MageRoleModel extends RoleModel {
    constructor(props: MageRoleModel['props']) {    
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 0 }}),
                health: new HealthModel({ state: { origin: 30 }}),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }
}