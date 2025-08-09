import { RoleModel } from "../../src/model/role";
import { AttackModel } from "../../src/model/role/attack";
import { HealthModel } from "../../src/model/role/health";

export class WispRoleModel extends RoleModel {
    constructor(props: WispRoleModel['props'] & {
        child: Pick<RoleModel.Child, 'attack' | 'health'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}