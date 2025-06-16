import { FeatureModel } from "@/common/feature";
import { Props } from "set-piece";

export class AbusiveSergeantBattlecryModel extends FeatureModel {
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
        });
    }
}