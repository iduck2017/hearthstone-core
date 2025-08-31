import { Event } from "set-piece";
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

export class ElusiveModel extends FeatureModel<
    ElusiveProps.E,
    ElusiveProps.S,
    ElusiveProps.C,
    ElusiveProps.R
> {
    constructor(props: ElusiveModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elusive',
                desc: 'Can\'t be targeted by spells or Hero Powers.',
                status: FeatureStatus.ACTIVE,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = 1;
        this.event.onActive(new Event({}));
        return true;
    }
}