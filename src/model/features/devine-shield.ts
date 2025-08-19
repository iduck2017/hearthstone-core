import { Model } from "set-piece";
import { FeatureModel } from ".";

export namespace DevineSheildModel {
    export type Event = {
        onActive: {};
        onDeactive: {};
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

    public active(): boolean {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.draft.state.level = 1;
        this.event.onActive({});
        return true;
    }

    public async deactive() {
        if (!this.state.isActive) return false;
        this.draft.state.isActive = false;
        this.draft.state.level =- 1;
        this.event.onDeactive({});
    }

    protected disable(): void {
        this.draft.state.isActive = false;
        this.draft.state.level = 0;
    }
}