import { Model } from "set-piece";
import { RoleModel } from "../role";
import { BuffModel } from "./buff";
import { CardModel } from "../card";

export namespace FeatureModel {
    export type State = {
        name: string;
        desc: string;
    }
    export type Event = {};
    export type Child = {
        buff?: BuffModel;
    };
    export type Refer = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureModel.Event> & Model.Event = {},
    S extends Partial<FeatureModel.State> & Model.State = {},
    C extends Partial<FeatureModel.Child> & Model.Child = {},
    R extends Partial<FeatureModel.Refer> & Model.Refer = {}
> extends Model<
    E & FeatureModel.Event,
    S & FeatureModel.State,
    C & FeatureModel.Child,
    R & FeatureModel.Refer
> {
    public get route() {
        const path = super.route.path;
        const role: RoleModel | undefined = path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = path.find(item => item instanceof CardModel);
        return { ...super.route, role, card }
    }

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'name' | 'desc'>;
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}