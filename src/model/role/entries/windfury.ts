import { Model, Route } from "set-piece";

export namespace WindfuryModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        isActive: boolean;
        isSuper: boolean;
    };
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export class WindfuryModel extends Model<
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
                name: "Windfury",
                desc: "Can attack twice each turn.",
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public use(): number {
        if (!this.state.isActive) return 0;
        if (this.state.isSuper) return 3;
        return 1;
    }
}