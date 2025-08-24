import { Model } from "set-piece";

export namespace ArmorModel {
    export type State = {
        origin: number;
    }
    export type Event = {}
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
}