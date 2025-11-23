import { FeatureModel } from "..";
import { BuffAggregationModel } from "./aggregation";

export namespace WeaponAttackBuffModel {
    export type E = {};
    export type S = {
        offset: number;
    };
    export type C = {};
    export type R = {};
}

export class WeaponAttackBuffModel extends FeatureModel<
    WeaponAttackBuffModel.E,
    WeaponAttackBuffModel.S,
    WeaponAttackBuffModel.C,
    WeaponAttackBuffModel.R
> {
    constructor(props: WeaponAttackBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                offset: 0,
                name: 'Weapon attack Buff',
                desc: "",
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}