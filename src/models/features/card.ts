import { Method, Model } from "set-piece";
import { PoisonousModel } from "../entries/poisonous";
import { FeatureModel, IRoleBuffModel } from "../..";

export namespace CardFeatsModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
        readonly feats: FeatureModel[];
    };
    export type R = {};
}

export abstract class CardFeatsModel<
    E extends Partial<CardFeatsModel.E> & Model.E = {},
    S extends Partial<CardFeatsModel.S> & Model.S = {},
    C extends Partial<CardFeatsModel.C> & Model.C = {},
    R extends Partial<CardFeatsModel.R> & Model.R = {},
> extends Model<
    E & CardFeatsModel.E, 
    S & CardFeatsModel.S, 
    C & CardFeatsModel.C, 
    R & CardFeatsModel.R
> {
    constructor(props: CardFeatsModel['props'] & {
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