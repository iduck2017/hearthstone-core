import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel } from "../features";
import { ROLE_ROUTE, RoleRoute } from "../..";

export namespace StealthProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@StoreUtil.is('stealth')
export class StealthModel extends FeatureModel<
    StealthProps.E,
    StealthProps.S,
    StealthProps.C,
    StealthProps.R,
    RoleRoute
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
                route: ROLE_ROUTE,
            }
        });
    }

    public active() {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }

}