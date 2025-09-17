import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel } from "../features";
import { RoleFeatureModel } from "../features/role";

export namespace FrozenProps {
    export type E = {
        onActive: Event
        onDeactive: Event
    }
    export type S = {}
    export type C = {}
}

@StoreUtil.is('frozen')
export class FrozenModel extends RoleFeatureModel<
    FrozenProps.E,
    FrozenProps.S,
    FrozenProps.C
> {
    constructor(loader?: Loader<FrozenModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Frozen',
                    desc: 'Frozen charactoers lose their next attack.',
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
        this.event.onActive(new Event());
        return true;
    }
}