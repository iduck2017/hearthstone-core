import { Event, Loader, StoreUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../types/damage";
import { FeatureModel } from "../features";

export namespace DivineSheildProps {
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
export class DivineSheildModel extends FeatureModel<
    DivineSheildProps.E,
    DivineSheildProps.S,
    DivineSheildProps.C,
    DivineSheildProps.R
> {
    constructor(loader?: Loader<DivineSheildModel>) {
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
        this.event.onUse(event);
        return true;
    }


    public deactive() {
        super.deactive();
        this.draft.state.count = 0;
    }
}