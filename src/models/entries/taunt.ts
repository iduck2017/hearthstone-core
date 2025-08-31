import { Event } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";

export namespace TauntProps {
    export type E = {
        onActive: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class TauntModel extends FeatureModel<
    TauntProps.E, 
    TauntProps.S, 
    TauntProps.C, 
    TauntProps.R
> {
    constructor(props: TauntModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Taunt',
                desc: 'Taunt',
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