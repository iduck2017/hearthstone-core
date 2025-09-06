import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel } from "../features";

export namespace StealthProps {
    export type E = {
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

@StoreUtil.is('stealth')
export class StealthModel extends FeatureModel<
    StealthProps.E,
    StealthProps.S,
    StealthProps.C,
    StealthProps.R
> {
    constructor(loader?: Loader<StealthModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Stealth',
                    desc: 'Can not be attacked or targeted until it attacks.',
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public active() {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }

    public deactive() {
        this.disable();
        this.event.onDeactive(new Event({}));
    }

}