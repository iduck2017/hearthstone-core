import { Method, Model } from "set-piece";
import { PoisonousModel } from "../entries/poisonous";
import { CardFeatureModel, FeatureModel } from "../../..";

export namespace CardFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
        readonly feats: CardFeatureModel[];
    };
    export type R = {};
}

export abstract class CardFeaturesModel<
    E extends Partial<CardFeaturesModel.E> & Model.E = {},
    S extends Partial<CardFeaturesModel.S> & Model.S = {},
    C extends Partial<CardFeaturesModel.C> & Model.C = {},
    R extends Partial<CardFeaturesModel.R> & Model.R = {},
> extends Model<
    E & CardFeaturesModel.E, 
    S & CardFeaturesModel.S, 
    C & CardFeaturesModel.C, 
    R & CardFeaturesModel.R
> {
    public get chunk() {
        return {
            poisonous: this.child.poisonous.state.isActive || undefined,
            feats: this.child.feats.map(item => item.chunk).filter(Boolean),
        }
    }

    constructor(props: CardFeaturesModel['props'] & {
        state: S;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {    
                poisonous: props.child.poisonous ?? new PoisonousModel({ state: { isActive: false }}),
                feats: props.child.feats ?? [],
                ...props.child 
            },
            refer: { ...props.refer },
        })
    }

    protected abstract query(feat: FeatureModel): FeatureModel[] | undefined;

    public add(feat: FeatureModel) {
        let feats = this.query(feat);
        if (!feats) return;
        feats.push(feat);
    }

    public del(feat: FeatureModel) {
        let feats = this.query(feat);
        if (!feats) return;
        const index = feats.indexOf(feat);
        if (index == -1) return;
        feats.splice(index, 1);
    }

}