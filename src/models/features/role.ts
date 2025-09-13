import { Loader, Method, Model, Props, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";

export namespace RoleFeaturesProps {
    export type E = {};
    export type S = {};
    export type C = {
        items: FeatureModel[];
    };
    export type P = {};
    export type R = {};
}

@StoreUtil.is('features')
export class RoleFeaturesModel extends Model<
    RoleFeaturesProps.E,
    RoleFeaturesProps.S,
    RoleFeaturesProps.C,
    RoleFeaturesProps.R
> {
    constructor(loader?: Loader<RoleFeaturesModel>) {
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


export namespace RoleFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {};
}

@StoreUtil.is('role-features')
export class RoleFeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
    P extends Partial<FeatureProps.P> & Props.P = {}
> extends FeatureModel<
    E & RoleFeatureProps.E,
    S & RoleFeatureProps.S,
    C & RoleFeatureProps.C,
    R & RoleFeatureProps.R,
    P & RoleFeatureProps.P
> {
    constructor(loader: Method<RoleFeatureModel['props'] & {
        uuid: string | undefined,
        state: S & FeatureProps.S,
        child: C,
        refer: R,
        route: P,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { ...props.route },
            }
        })
    }
}