import { FeatureModel } from ".";
import { Props } from "set-piece";

export abstract class EffectModel extends FeatureModel {
    constructor(props: Props<
        FeatureModel.State,
        FeatureModel.Child,
        FeatureModel.Refer
    > & {
        state: {
            name: string;
            desc: string;
        };
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}