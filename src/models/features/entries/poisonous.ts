import { DebugUtil, Event, TemplUtil } from "set-piece"
import { FeatureModel } from "../../features"
import { RoleFeatureModel } from "../role"

export namespace PoisonousModel {  
    export type E = {
        onActive: Event
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('poisonous')
export class PoisonousModel extends RoleFeatureModel<
    PoisonousModel.E,
    PoisonousModel.S,
    PoisonousModel.C,
    PoisonousModel.R
> {
    constructor(props?: PoisonousModel['props']) {
        super({
            uuid: props?.uuid,
            state: { 
                isEnabled: true,
                name: 'Poisonous',
                desc: 'Destroy any miniondamaged by this.',
                ...props?.state 
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }
}