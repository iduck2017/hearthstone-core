import { Event, Loader, StoreUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../types/damage";
import { FeatureModel } from "../features";

export namespace DivineSheildProps {
    export type E = {
        onActive: Event
        onConsume: DamageEvent
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
            }
        })
    }

    public active(): boolean {
        if (this.state.isActive) return false; 
        this.doActive();
        this.event.onActive(new Event({}));
        return true;
    }

    @TranxUtil.span()
    private doActive() {
        this.draft.state.isActive = true;
        this.draft.state.count = 1;
    }

    public async use() {
        if (!this.state.isActive) return false;
        if (this.draft.state.count <= 1) this.draft.state.isActive = false;
        this.draft.state.count =- 1;
        return true;
    }

    public onUse(event: DamageEvent) {
        this.event.onConsume(event);
    }

    public disable() {
        super.disable();
        this.draft.state.count = 0;
    }
}