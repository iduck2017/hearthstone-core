import { MinionCardModel } from "@/common/minion-card";
import { WispRoleModel } from "./role";
import { CheckService, Props, StoreService } from "set-piece";
import { MinionRace } from "@/types/card";

@StoreService.is('wisp-card')
export class WispCardModel extends MinionCardModel {
    constructor(props: Props<
        MinionCardModel.State,
        MinionCardModel.Child,
        MinionCardModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                mana: 0,
                race: [MinionRace.UNDEAD],
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
