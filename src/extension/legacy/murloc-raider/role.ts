import { MinionRoleModel } from "@/common/role/minion";
import { MinionRaceType } from "@/types/card";

export class MurlocRaiderRoleModel extends MinionRoleModel {
    constructor(props: MurlocRaiderRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 2,
                health: 1,
                races: [MinionRaceType.MURLOC],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }
}