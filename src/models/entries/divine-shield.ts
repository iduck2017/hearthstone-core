import { Event, Loader, StoreUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../types/damage";
import { FeatureModel } from "../features";

export namespace DivineShieldProps {
    export type E = {
        onUse: DamageEvent
    }
    export type S = {
        count: number
    }
    export type C = {}
    export type R = {}
}

@StoreUtil.is('divine-shield')
export class DivineShieldModel extends FeatureModel<
    DivineShieldProps.E,
    DivineShieldProps.S,
    DivineShieldProps.C,
    DivineShieldProps.R
> {
    constructor(loader?: Loader<DivineShieldModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Divine Shield',
                    desc: 'The first time you take damage, ignore it.',
                    isActive: true,
                    count: props.state?.isActive ? 1 : 0,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    @TranxUtil.span()
    public active(): boolean {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.draft.state.count = 1;
        return true;
    }

    public async use(event: DamageEvent) {
        if (!this.state.isActive) return false;
        if (this.draft.state.count <= 1) this.draft.state.isActive = false;
        this.draft.state.count =- 1;
        event.config({ divineShield: true });
        this.event.onUse(event);
        return true;
    }


    public deactive() {
        super.deactive();
        this.draft.state.count = 0;
    }
}