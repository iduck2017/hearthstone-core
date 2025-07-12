import { RoleModel } from "../role";

export class DemoRoleModel extends RoleModel {
    constructor(props: DemoRoleModel['props'] & {
        state: Pick<RoleModel.State, 'attack' | 'health'>
    }) {
        super({
            uuid: props.uuid,
            state: { 
                races: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}