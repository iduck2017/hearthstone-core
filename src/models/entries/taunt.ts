import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";

export namespace TauntProps {
    export type E = {
        onActive: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

@StoreUtil.is('taunt')
export class TauntModel extends FeatureModel<
    TauntProps.E, 
    TauntProps.S, 
    TauntProps.C, 
    TauntProps.R
> {
    constructor(loader?: Loader<TauntModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Taunt',
                    desc: 'Taunt',
                    status: FeatureStatus.ACTIVE,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    public active(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = 1;
        this.event.onActive(new Event({}));
        return true;
    }
}