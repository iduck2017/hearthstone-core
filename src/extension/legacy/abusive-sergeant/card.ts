import { MinionCardModel } from "@/common/card/minion";
import { AbusiveSergeantRoleModel } from "./role";

export class AbusiveSergeantCardModel extends MinionCardModel {
    constructor(props: AbusiveSergeantCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new AbusiveSergeantRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}