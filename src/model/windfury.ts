import { Model } from "set-piece";

export namespace WindfuryModel {
    export type Route = {}
    export type State = {
        isActive: boolean;
        isSuper: boolean;
    };
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export class WindfuryModel extends Model<
    WindfuryModel.Route,
    WindfuryModel.Event,
    WindfuryModel.State,
    WindfuryModel.Child,
    WindfuryModel.Refer
> {
    constructor(props: WindfuryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                isActive: false,
                isSuper: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
            route: {}
        });
    }

    public check(): number {
        if (!this.state.isActive) return 0;
        if (this.state.isSuper) return 3;
        return 1;
    }
}