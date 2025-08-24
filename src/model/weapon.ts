import { Model } from "set-piece";

export namespace WeaponModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class WeaponModel extends Model<
    WeaponModel.Event,
    WeaponModel.State,
    WeaponModel.Child,
    WeaponModel.Refer
> {
    constructor(props: WeaponModel['props'] & {
        state: WeaponModel.State;
        child: WeaponModel.Child;
        refer: WeaponModel.Refer;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}