import { MinionCardModel } from "@/common/card/minion";
import { MurlocRaiderRoleModel } from "./role";

export class MurlocRaiderCardModel extends MinionCardModel {
    constructor(props: MurlocRaiderCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Raider',
                desc: '',
                mana: 1,
                ...props.state
            },
            child: {
                role: new MurlocRaiderRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}   