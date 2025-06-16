import { FeatureModel } from "@/common/feature";
import { BattlecryModel } from "@/common/feature/battlecry";
import { EffectModel } from "@/common/feature/effect";
import { Props } from "set-piece";

export class AbusiveSergeantEffectModel extends EffectModel {
    constructor(props: Props<
        FeatureModel.State,
        FeatureModel.Child,
        FeatureModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Effect',
                desc: 'Give a minion +2 Attack this turn.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


}
