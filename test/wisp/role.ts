import { RoleModel } from "../../src/model/role";

export class WispRoleModel extends RoleModel {
    constructor(props: WispRoleModel['props'] & {
        child: Pick<RoleModel.Child, 'health' | 'attack'>
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}