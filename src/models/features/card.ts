import { Loader, Method, Model, Props, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";

export namespace CardFeaturesProps {
    export type E = {};
    export type S = {};
    export type C = {
        items: FeatureModel[];
    };
    export type P = {};
    export type R = {};
}

@StoreUtil.is('features')
export class CardFeaturesModel extends Model<
    CardFeaturesProps.E,
    CardFeaturesProps.S,
    CardFeaturesProps.C,
    CardFeaturesProps.R
> {
    constructor(loader?: Loader<CardFeaturesModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    items: props.child?.items ?? [],
                    ...props.child
                },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    public add(feature: FeatureModel) {
        this.draft.child.items.push(feature);
        return feature;
    }
}


export namespace CardFeatureProps {
    export type P = {};
}

@StoreUtil.is('card-features')
export class CardFeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
    P extends Partial<FeatureProps.P> & Props.P = {}
> extends FeatureModel<
    E,
    S,
    C,
    R,
    CardFeatureProps.P
> {
    constructor(loader: Method<CardFeatureModel['props'] & {
        uuid: string | undefined,
        state: S & FeatureProps.S,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }
}