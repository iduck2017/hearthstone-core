import { StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { SleepModel } from "../role/sleep";

export enum RushStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    ACTIVE_ONCE = 2,
}

export namespace RushModel {
    export type Event = {
        onActive: {};
    };
    export type State = {
        status: RushStatus;
    }
    export type Child = {};
    export type Refer = {};
}

export class RushModel extends FeatureModel<
    RushModel.Event,
    RushModel.State,
    RushModel.Child,
    RushModel.Refer
> {
    constructor(props: RushModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Rush',
                desc: 'Can attack minions immediately.',
                status: RushStatus.ACTIVE,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = RushStatus.ACTIVE;
        this.event.onActive({});
        return true;
    }

    public deactive(): boolean {
        if (!this.state.status) return false;
        this.draft.state.status = RushStatus.ACTIVE_ONCE;
        return true;
    }


    @StateUtil.on(self => self.route.role?.proxy.child.sleep.decor)
    protected onSleepCheck(that: SleepModel, state: SleepModel.State) {
        if (!this.state.status) return state;
        const result = { ...state };
        result.status = false;
        return result;
    }
}