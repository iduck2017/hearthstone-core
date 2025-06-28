import { MinionCardModel } from "@/common/card/minion";
import { ElvenArcherRoleModel } from "./role";
import { ElvenArcherBattlecryModel } from "./battlecry";
import { FeatureModel } from "@/common/feature";

export class ElvenArcherCardModel extends MinionCardModel {
    constructor(props: ElvenArcherCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer',
                desc: 'Battlecry: Deal 1 damage.',
                mana: 1,
                keywords: [],
                ...props.state,
            },
            child: {
                role: new ElvenArcherRoleModel({}),
                ...props.child,
                battlecries: FeatureModel.assign(
                    props.child?.battlecries,
                    new ElvenArcherBattlecryModel({})
                ),
            },
            refer: { ...props.refer },
        });
    }
}