import { StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { SleepModel } from "../role/sleep";
import { RushModel, RushStatus } from "./rush";

export namespace ChargeModel {
    export type Event = {
        onActive: {};
    };
    export type State = {};
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
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }


    @StateUtil.on(self => self.route.role?.proxy.child.sleep.decor)
    protected onSleepCheck(that: SleepModel, state: SleepModel.State) {
        if (!this.state.status) return state;
        const result = { ...state };
        result.status = false;
        return result;
    }
}