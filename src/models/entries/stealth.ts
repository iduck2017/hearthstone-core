import { Event } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";

export namespace StealthProps {
    export type E = {
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class StealthModel extends FeatureModel<
    StealthProps.E,
    StealthProps.S,
    StealthProps.C,
    StealthProps.R
> {
    constructor(props: StealthModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Stealth',
                desc: '',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active() {
        if (this.state.status) return false; 
        this.draft.state.status = FeatureStatus.ACTIVE;
        this.event.onActive(new Event({}));
        return true;
    }

    public deactive() {
        this.disable();
        this.event.onDeactive(new Event({}));
    }

}