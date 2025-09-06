import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";

export namespace ElusiveProps {
    export type E = {
        onActive: Event
        onDeactive: Event
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('elusive')
export class ElusiveModel extends FeatureModel<
    ElusiveProps.E,
    ElusiveProps.S,
    ElusiveProps.C,
    ElusiveProps.R
> {
    constructor(loader?: Loader<ElusiveModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Elusive',
                    desc: 'Can\'t be targeted by spells or Hero Powers.',
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