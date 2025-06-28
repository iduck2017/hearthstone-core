import { MinionCardModel } from "@/common/card/minion";
import { WispRoleModel } from "./role";
import { StoreService } from "set-piece";
import { MinionRaceType } from "@/types/card";

@StoreService.is('wisp-card')
export class WispCardModel extends MinionCardModel {
    constructor(props: WispCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                mana: 0,
                ...props.state,
            },
            child: { 
                role: new WispRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

}
