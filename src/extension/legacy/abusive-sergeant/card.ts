import { MinionCardModel } from "@/common/card/minion";
import { AbusiveSergeantRoleModel } from "./role";
import { AbusiveSergeantBattlecryModel } from "./battlecry";

export class AbusiveSergeantCardModel extends MinionCardModel {
    constructor(props: AbusiveSergeantCardModel['props']) {
        const battlecries = props.child?.battlecries ?? [];
        if (!battlecries.find(item => item instanceof AbusiveSergeantBattlecryModel)) {
            battlecries.push(new AbusiveSergeantBattlecryModel({}));
        }
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
                battlecries,
            },
            refer: { ...props.refer },
        });
    }
}