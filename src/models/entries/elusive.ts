import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel } from "../features";
import { RoleFeatureModel } from "../features/role";

export namespace ElusiveProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = {}
}

@StoreUtil.is('elusive')
export class ElusiveModel extends RoleFeatureModel<
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
                    isActive: true,
                    ...props.state,
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
        this.event.onActive(new Event());
        return true;
    }
}