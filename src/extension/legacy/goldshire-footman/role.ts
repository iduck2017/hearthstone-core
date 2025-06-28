import { MinionRoleModel } from "@/common/role/minion";

export class GoldshireFootmanRoleModel extends MinionRoleModel {
    constructor(props: GoldshireFootmanRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 2,
                races: [],
                isTaunt: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }
}