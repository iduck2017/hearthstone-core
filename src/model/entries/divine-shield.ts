import { FeatureModel } from "../features";
import { DamageEvent } from "../../utils/damage";

export namespace DivineSheildModel {
    export type Event = {
        onActive: {};
        onDeactive: DamageEvent;
    };
    export type State = {
        isActive: boolean;
        count: number;
    };
    export type Child = {};
    export type Refer = {};
}

export class DivineSheildModel extends FeatureModel<
    DivineSheildModel.Event,
    DivineSheildModel.State,
    DivineSheildModel.Child,
    DivineSheildModel.Refer
> {
    constructor(props: DivineSheildModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Divine Shield',
                desc: 'The first time you take damage, ignore it.',
                isActive: false,
                count: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(): boolean {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.draft.state.count = 1;
        this.event.onActive({});
        return true;
    }

    public async deactive() {
        if (!this.state.isActive) return false;
        this.draft.state.isActive = false;
        this.draft.state.count =- 1;
    }

    public onDeactive(event: DamageEvent) {
        this.event.onDeactive(event);
    }

    protected disable(): void {
        this.draft.state.isActive = false;
        this.draft.state.count = 0;
    }
}