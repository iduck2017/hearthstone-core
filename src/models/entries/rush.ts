import { Decor, Event, Loader, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { SleepModel, SleepProps } from "../rules/sleep";
import { RoleFeatureModel } from "../features/role";

export namespace RushProps {
    export type E = {
        onActive: Event;
    };
    export type S = {}
    export type C = {};
    export type R = {};
}

@StoreUtil.is('rush')
export class RushModel extends RoleFeatureModel<
    RushProps.E,
    RushProps.S,
    RushProps.C,
    RushProps.R
> {
    constructor(loader?: Loader<RushModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Rush',
                    desc: 'Can attack minions immediately.',
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        this.draft.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }

}