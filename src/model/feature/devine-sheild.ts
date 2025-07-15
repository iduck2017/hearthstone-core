import { Model } from "set-piece";
import { FeatureModel } from ".";
import { RoleModel } from "../role";
import { CardModel } from "../card";
import { RootModel } from "../root";

export namespace DevineSheildModel {
    export type State = {
        isActive: boolean;
    };
    export type Event = {
    };
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
                desc: "The first time this takes damage, ignore it.",
                ...props.state,
            },
            child: {},
            refer: {}
        })
    }

    protected check(): boolean {
        return true;
    }

    public use(): boolean {
        if (!this.state.isActive) return false;
        if (!this.check()) return false;
        this.draft.state.isActive = false;
        return true;
    }

    public get() {

    }
}