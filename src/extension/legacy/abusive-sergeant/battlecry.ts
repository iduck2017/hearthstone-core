import { MinionCardModel } from "@/common/card/minion";
import { FeatureModel } from "@/common/feature";
import { BattlecryModel } from "@/common/feature/battlecry";
import { GameQuery } from "@/types/query";
import { Props } from "set-piece";

export class AbusiveSergeantBattlecryModel extends BattlecryModel<
    MinionCardModel
> {
    constructor(props: Props<
        FeatureModel.State,
        FeatureModel.Child,
        FeatureModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Battlecry',
                desc: 'Give a minion +2 Attack this turn.',
                ...props.state,
            },
            child: {},
            refer: {}
        });
    }

    public prepare(): GameQuery | undefined {
        return undefined;
    }


}