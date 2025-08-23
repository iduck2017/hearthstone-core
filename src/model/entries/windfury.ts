import { StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { ActionModel } from "../role/action";

export enum WindfuryStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    SUPER_ACTIVE = 2,
}

export namespace WindfuryModel {
    export type Event = {
        onGet: {};
    };
    export type State = {
        isActive: WindfuryStatus;
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
                isActive: WindfuryStatus.INACTIVE,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(status: WindfuryStatus): boolean {
        if (this.state.isActive) return false;
        this.draft.state.isActive = status;
        this.event.onGet({});
        return true;
    }
    
    @TranxUtil.span()
    protected disable(): void {
        this.draft.state.isActive = WindfuryStatus.INACTIVE;
        this.reload();
    }

    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    protected onCheck(that: ActionModel, state: ActionModel.State) {
        if (!this.state.isActive) return state;
        const offset = this.state.isActive === WindfuryStatus.SUPER_ACTIVE ? 3 : 1;
        return {
            ...state,
            origin: state.origin + offset,
        }
    }
}
