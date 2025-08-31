import { Decor, Event, StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { ActionProps, ActionModel } from "../rules/action";

export enum WindfuryStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    ACTIVE_SUPER = 2,
}

export namespace WindfuryProps {
    export type E = {
        onActive: Event;
    };
    export type S = {
        status: WindfuryStatus;
    };
    export type C = {};
    export type R = {};
}

export class WindfuryModel extends FeatureModel<
    WindfuryProps.E,
    WindfuryProps.S,
    WindfuryProps.C,
    WindfuryProps.R
> {
    constructor(props: WindfuryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Windfury',
                desc: 'Can attack twice each turn.',
                status: WindfuryStatus.ACTIVE,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(status: WindfuryStatus): boolean {
        if (this.state.status) return false;
        this.draft.state.status = status;
        this.event.onActive(new Event({}));
        return true;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    protected onCheck(that: ActionModel, state: Decor<ActionProps.S>) {
        if (!this.state.status) return;
        const offset = this.state.status === WindfuryStatus.ACTIVE_SUPER ? 3 : 1;
        state.current.origin += offset;
    }
}
