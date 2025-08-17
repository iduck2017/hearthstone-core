import { Model } from "set-piece";
import { FeatureModel } from ".";

export namespace DevineSheildModel {
    export type Event = {
        onGet: {};
        onUse: {};
    };
    export type State = {
        isActive: boolean;
        level: number;
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
                level: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get(): boolean {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.draft.state.level = 1;
        this.event.onGet({});
        return true;
    }

    public async use() {
        this.draft.state.isActive = false;
        this.draft.state.level =- 1;
        this.event.onUse({});
    }

    protected disable(): void {
        this.draft.state.isActive = false;
        this.draft.state.level = 0;
    }
}