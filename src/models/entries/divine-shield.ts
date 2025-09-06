import { Event, Loader, StoreUtil } from "set-piece";
import { DamageEvent } from "../../types/damage";
import { FeatureModel, FeatureStatus } from "../features";

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
                    status: FeatureStatus.ACTIVE,
                    count: 1,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    public actve(): boolean {
        if (this.state.status) return false; 
        this.draft.state.status = 1;
        this.draft.state.count = 1;
        this.event.onActive(new Event({}));
        return true;
    }

    public async consume() {
        if (!this.state.status) return false;
        if (this.draft.state.count <= 1) this.draft.state.status = 0;
        this.draft.state.count =- 1;
        return true;
    }

    public onConsume(event: DamageEvent) {
        this.event.onConsume(event);
    }

    public disable() {
        super.disable();
        this.draft.state.count = 0;
    }
}