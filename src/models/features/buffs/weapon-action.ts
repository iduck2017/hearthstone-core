import { FeatureModel } from "..";
import { BuffAggregationModel } from "./aggregation";

export namespace WeaponActionkBuffModel {
    export type E = {};
    export type S = {
        offset: number;
    };
    export type C = {};
    export type R = {};
}

export class WeaponActionkBuffModel extends FeatureModel<
    WeaponActionkBuffModel.E,
    WeaponActionkBuffModel.S,
    WeaponActionkBuffModel.C,
    WeaponActionkBuffModel.R
> {
    constructor(props: WeaponActionkBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                offset: 0,
                name: 'Weapon action Buff',
                desc: "",
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}