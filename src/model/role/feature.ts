import { Model } from "set-piece";
import { RoleModel } from ".";
import { BuffModel } from "./buff";
import { CardModel } from "../card";

export namespace RoleFeatureModel {
    export type State = {}
    export type Event = {};
    export type Child = {
        buff?: BuffModel;
    };
    export type Refer = {};
}

export abstract class RoleFeatureModel<
    E extends Partial<RoleFeatureModel.Event> & Model.Event = {},
    S extends Partial<RoleFeatureModel.State> & Model.State = {},
    C extends Partial<RoleFeatureModel.Child> & Model.Child = {},
    R extends Partial<RoleFeatureModel.Refer> & Model.Refer = {}
> extends Model<
    E & RoleFeatureModel.Event,
    S & RoleFeatureModel.State,
    C & RoleFeatureModel.Child,
    R & RoleFeatureModel.Refer
> {
    public get route() {
        const path = super.route.path;
        const role: RoleModel | undefined = path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = path.find(item => item instanceof CardModel);
        return { ...super.route, role, card }
    }

    constructor(props: RoleFeatureModel['props'] & {
        uuid: string | undefined;
        state: S
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

    protected abstract check(): boolean;
}