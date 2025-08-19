import { Model, StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from ".";
import { ActionModel } from "../role/action";

export namespace WindfuryModel {
    export type Event = {
        onGet: {};
    };
    export type State = {
        isActive: boolean;
        level: number;
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
        this.event.onGet({});
        return true;
    }
    
    @TranxUtil.span()
    protected disable(): void {
        this.draft.state.isActive = false;
        this.draft.state.level = 0;
        this.reload();
    }

    // @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    // protected onCheck(that: ActionModel, state: ActionModel.State) {
    //     if (!this.state.isActive) return state;
    //     return {
    //         ...state,
    //         origin: state.origin + this.state.level,
    //     }
    // }
}
