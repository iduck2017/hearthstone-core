import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel } from "../features";
import { RoleFeatureModel } from "../features/role";

export namespace TauntProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@StoreUtil.is('taunt')
export class TauntModel extends RoleFeatureModel<
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
                    desc: 'Enemies must attack this minion.',
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
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