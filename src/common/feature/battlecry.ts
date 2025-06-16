import { FeatureModel } from ".";
import { Props } from "set-piece";

export abstract class BattlecryModel extends FeatureModel {
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

    public abstract prepare(): void;
}