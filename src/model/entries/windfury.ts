import { StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { ActionModel } from "../role/action";

export enum WindfuryStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    ACTIVE_SUPER = 2,
}

export namespace WindfuryModel {
    export type Event = {
        onGet: {};
    };
    export type State = {
        status: WindfuryStatus;
    };
    export type Child = {};
    export type Refer = {};
}

export class WindfuryModel extends FeatureModel<
    WindfuryModel.Event,
    WindfuryModel.State,
    WindfuryModel.Child,
    WindfuryModel.Refer
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
        this.event.onGet({});
        return true;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    protected onActionCheck(that: ActionModel, state: ActionModel.State) {
        if (!this.state.status) return state;
        const offset = this.state.status === WindfuryStatus.ACTIVE_SUPER ? 3 : 1;
        const result = { ...state };
        result.origin = state.origin + offset;
        return result;
    }
}
