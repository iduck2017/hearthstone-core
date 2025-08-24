import { Model } from "set-piece";

export namespace ArmorModel {
    export type State = {
        origin: number;
    }
    export type Event = {
        onGain: { value: number };
    }
    export type Child = {}
    export type Refer = {}
}

export class ArmorModel extends Model<
    ArmorModel.Event, 
    ArmorModel.State, 
    ArmorModel.Child, 
    ArmorModel.Refer
> {
    constructor(props: ArmorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                origin: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public gain(value: number) {
        this.draft.state.origin += value;
        this.event.onGain({ value });
    }
}