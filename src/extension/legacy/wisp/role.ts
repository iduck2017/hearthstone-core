import { MinionRoleModel } from "@/common/role/minion";
import { RoleModel } from "@/common/role";
import { StoreService } from "set-piece";
import { MinionRaceType } from "@/types/card";

@StoreService.is('wisp-role')
export class WispRoleModel extends MinionRoleModel {
    constructor(props: WispRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                races: [MinionRaceType.UNDEAD],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}