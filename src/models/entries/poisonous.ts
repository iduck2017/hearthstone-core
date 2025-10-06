import { Event, Loader, StoreUtil } from "set-piece"
import { FeatureModel } from "../features"

export namespace PoisonousProps {  
    export type E = {
        onActive: Event
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('poisonous')
export class PoisonousModel extends FeatureModel<
    PoisonousProps.E,
    PoisonousProps.S,
    PoisonousProps.C,
    PoisonousProps.R
> {
    constructor(loader?: Loader<PoisonousModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    isActive: true,
                    name: 'Poisonous',
                    desc: 'Destroy any miniondamaged by this.',
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        this.draft.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }
}