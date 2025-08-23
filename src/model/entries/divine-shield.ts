import { FeatureModel } from "../features";
import { DamageEvent } from "../../utils/damage";

export namespace DivineSheildModel {
    export type Event = {
        onGet: {};
        onBreak: DamageEvent;
    };
    export type State = {
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
                status: 1,
                count: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get(): boolean {
        if (this.state.status) return false; 
        this.draft.state.status = 1;
        this.draft.state.count = 1;
        this.event.onGet({});
        return true;
    }

    public async break() {
        if (!this.state.status) return false;
        if (this.draft.state.count <= 1) this.draft.state.status = 0;
        this.draft.state.count =- 1;
        return true;
    }

    public onBreak(event: DamageEvent) {
        this.event.onBreak(event);
    }

    public disable() {
        super.disable();
        this.draft.state.count = 0;
    }
}