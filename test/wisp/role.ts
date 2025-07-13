import { RoleModel } from "../../src/model/role";

export class WispRoleModel extends RoleModel {
    constructor(props: WispRoleModel['props'] & {
        state: Pick<RoleModel.State, 'attack' | 'health'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}