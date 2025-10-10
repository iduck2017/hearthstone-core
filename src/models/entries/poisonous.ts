import { Event, TemplUtil } from "set-piece"
import { FeatureModel } from "../rules/feature"

export namespace PoisonousModel {  
    export type E = {
        onActive: Event
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('poisonous')
export class PoisonousModel extends FeatureModel<
    PoisonousModel.E,
    PoisonousModel.S,
    PoisonousModel.C,
    PoisonousModel.R
> {
    constructor(props?: PoisonousModel['props']) {
        super({
            uuid: props?.uuid,
            state: { 
                isActive: true,
                name: 'Poisonous',
                desc: 'Destroy any miniondamaged by this.',
                ...props?.state 
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }
}