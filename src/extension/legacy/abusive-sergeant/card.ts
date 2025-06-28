import { MinionCardModel } from "@/common/card/minion";
import { AbusiveSergeantRoleModel } from "./role";
import { AbusiveSergeantBattlecryModel } from "./battlecry";
import { FeatureModel } from "@/common/feature";

export class AbusiveSergeantCardModel extends MinionCardModel {
    constructor(props: AbusiveSergeantCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.',
                mana: 1,
                keywords: [],
                ...props.state,
            },
            child: {
                role: new AbusiveSergeantRoleModel({}),
                ...props.child,
                battlecries: FeatureModel.assign(
                    props.child?.battlecries, 
                    new AbusiveSergeantBattlecryModel({})
                ),
            },
            refer: { ...props.refer },
        });
    }
}