import { StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from ".";
import { SleepModel } from "../role/sleep";

export enum RushStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    FINISH = 2,
}

export namespace RushModel {
    export type Event = {
        onActive: {};
    };
    export type State = {
        isActive: RushStatus;
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
                isActive: RushStatus.INACTIVE,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        this.draft.state.isActive = RushStatus.ACTIVE;
        this.event.onActive({});
        return true;
    }

    public deactive(): boolean {
        if (!this.state.isActive) return false;
        this.draft.state.isActive = RushStatus.FINISH;
        return true;
    }

    @TranxUtil.span()
    protected disable(): void {
        this.draft.state.isActive = RushStatus.INACTIVE;
        this.reload();
    }

    // @StateUtil.on(self => self.route.role?.proxy.child.sleep.decor)
    // protected onCheck(that: SleepModel, state: SleepModel.State) {
    //     if (!this.state.isActive) return state;
    //     return {
    //         ...state,
    //         isActive: false,
    //     }
    // }
}