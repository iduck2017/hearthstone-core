import { Event, ChunkService } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../role";

export namespace ChargeModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@ChunkService.is('charge')
export class ChargeModel extends RoleFeatureModel<
    ChargeModel.E,
    ChargeModel.S,
    ChargeModel.C,
    ChargeModel.R
> {
    constructor(props?: ChargeModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Charge',
                desc: 'Can attack immediately.',
                isEnabled: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }
}