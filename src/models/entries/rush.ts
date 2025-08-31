import { Decor, Event, StateUtil } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";
import { SleepModel, SleepProps } from "../rules/sleep";

export enum RushStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    ACTIVE_ONCE = 2,
}

export namespace RushProps {
    export type E = {
        onActive: Event;
    };
    export type S = {
        status: RushStatus;
    }
    export type C = {};
    export type R = {};
}

export class RushModel extends FeatureModel<
    RushProps.E,
    RushProps.S,
    RushProps.C,
    RushProps.R
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
        this.event.onActive(new Event({}));
        return true;
    }

    public overdue(): boolean {
        if (!this.state.status) return false;
        this.draft.state.status = RushStatus.ACTIVE_ONCE;
        return true;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.sleep.decor)
    protected onSleepCheck(that: SleepModel, state: Decor<SleepProps.S>) {
        if (!this.state.status) return;
        state.current.status = FeatureStatus.INACTIVE;
    }
}