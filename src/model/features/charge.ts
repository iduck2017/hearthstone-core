import { StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from ".";
import { ActionModel } from "../role/action";
import { SleepModel } from "../role/sleep";
import { RushModel, RushStatus } from "./rush";

export namespace ChargeModel {
    export type Event = {
        onActive: {};
    };
    export type State = {
        isActive: boolean;
    }
    export type Child = {};
    export type Refer = {};
}

export class ChargeModel extends FeatureModel<
    ChargeModel.Event,
    ChargeModel.State,
    ChargeModel.Child,
    ChargeModel.Refer
> {
    constructor(props: ChargeModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Charge',
                desc: 'Can attack immediately.',
                isActive: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    @TranxUtil.span()
    protected disable(): void {
        this.draft.state.isActive = false;
        this.reload();
    }

    // @StateUtil.on(self => self.route.role?.proxy.child.sleep.decor)
    // protected onSleepCheck(that: SleepModel, state: SleepModel.State) {
    //     if (!this.state.isActive) return state;
    //     return {
    //         ...state,
    //         isActive: false,
    //     }
    // }

    // @StateUtil.on(self => self.route.role?.proxy.child.rush.decor)
    // protected onRushCheck(that: RushModel, state: RushModel.State & FeatureModel.State) {
    //     if (!this.state.isActive) return state;
    //     return {
    //         ...state,
    //         isActive: RushStatus.INACTIVE,
    //     }
    // }

}