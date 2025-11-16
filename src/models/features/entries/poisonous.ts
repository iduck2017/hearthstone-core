import { DebugUtil, Event, TemplUtil } from "set-piece"
import { FeatureModel } from "../../features"
import { RoleFeatureModel } from "../../features/minion"

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
                actived: true,
                name: 'Poisonous',
                desc: 'Destroy any miniondamaged by this.',
                ...props?.state 
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active(): boolean {
        if (this.state.actived) return false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Poisonous`);
        this.origin.state.actived = true;
        this.event.onEnable(new Event({}));
        return true;
    }
}