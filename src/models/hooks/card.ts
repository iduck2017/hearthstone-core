import { Method, Model, Props } from "set-piece";
import { PoisonousModel } from "../entries/poisonous";
import { CARD_ROUTE, CardRoute, FeatureModel, RoleBuffModel } from "../..";

export namespace CardFeatsProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
        readonly items: FeatureModel[];
    };
    export type R = {};
    export type P = CardRoute;
}

export abstract class CardFeatsModel<
    E extends Partial<CardFeatsProps.E> & Props.E = {},
    S extends Partial<CardFeatsProps.S> & Props.S = {},
    C extends Partial<CardFeatsProps.C> & Props.C = {},
    R extends Partial<CardFeatsProps.R> & Props.R = {},
    P extends Partial<CardFeatsProps.P> & Props.P = {}
> extends Model<
    E & CardFeatsProps.E, 
    S & CardFeatsProps.S, 
    C & CardFeatsProps.C, 
    R & CardFeatsProps.R,
    P & CardFeatsProps.P
> {
    constructor(loader: Method<CardFeatsModel['props'] & {
        state: S;
        child: C;
        refer: R;
        route: P
    }, []>) {
        super(() => {
            const props = loader();
            return {    
                uuid: props.uuid,
                state: { ...props.state },
                child: {    
                    poisonous: props.child.poisonous ?? new PoisonousModel(),
                    items: props.child.items ?? [],
                    ...props.child 
                },
                refer: { ...props.refer },
                route: { 
                    ...CARD_ROUTE,
                    ...props.route 
                },
            }
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