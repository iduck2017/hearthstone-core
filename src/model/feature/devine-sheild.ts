import { Model } from "set-piece";
import { FeatureModel } from ".";
import { RoleModel } from "../role";

export namespace DevineSheildModel {
    export type State = {
        isActive: boolean;
    };
    export type Event = {};
    export type Refer = {};
    export type Child = {};
}

export class DevineSheildModel extends FeatureModel<
    DevineSheildModel.Event,
    DevineSheildModel.State,
    DevineSheildModel.Child,
    DevineSheildModel.Refer
> {
    constructor(props: DevineSheildModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                isActive: false,
                name: "Devine Shield",
                desc: "",
                ...props.state,
            },
            child: {},
            refer: {}
        })
    }
}