import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";

export namespace FrozenProps {
    export type E = {
        onActive: Event
        onDeactive: Event
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('frozen')
export class FrozenModel extends FeatureModel<
    FrozenProps.E,
    FrozenProps.S,
    FrozenProps.C,
    FrozenProps.R
> {
    constructor(loader?: Loader<FrozenModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Frozen',
                    desc: 'Frozen charactoers lose their next attack.',
                    status: FeatureStatus.ACTIVE,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public active(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = FeatureStatus.ACTIVE;
        this.event.onActive(new Event({}));
        return true;
    }

    public deactive(): boolean {
        const role = this.route.role;
        if (!role) return false;
        const action = role.child.action;
        if (action.state.current <= 0) return false;
        this.disable();
        this.event.onDeactive(new Event({}));
        return true;
    }
}