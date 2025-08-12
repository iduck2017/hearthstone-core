import { Model } from "set-piece";
import { FeatureModel } from "../features";

export namespace DevineSheildModel {
    export type Event = {
        onGet: {};
        onUse: {};
    };
    export type State = {
        isActive: boolean;
    };
    export type Child = {};
    export type Refer = {};
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
                name: 'Devine Shield',
                desc: 'The first time you take damage, ignore it.',
                isActive: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get(): boolean {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.event.onGet({});
        return true;
    }

    public async use() {
        this.event.onUse({});
    }
}