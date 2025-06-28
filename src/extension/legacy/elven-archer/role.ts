import { MinionRoleModel } from "@/common/role/minion";

export class ElvenArcherRoleModel extends MinionRoleModel {
    constructor(props: ElvenArcherRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                races: [],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}