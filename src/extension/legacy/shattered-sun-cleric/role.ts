import { MinionRoleModel } from "@/common/role/minion";

export class ShatteredSunClericRoleModel extends MinionRoleModel {
    constructor(props: ShatteredSunClericRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 3,
                maxHealth: 2,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}