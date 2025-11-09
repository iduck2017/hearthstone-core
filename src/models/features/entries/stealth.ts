import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "..";
import { MinionFeatureModel } from "../minion";

export namespace StealthModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@TemplUtil.is('stealth')
export class StealthModel extends MinionFeatureModel<
    StealthModel.E,
    StealthModel.S,
    StealthModel.C,
    StealthModel.R
> {
    constructor(props?: StealthModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Stealth',
                desc: 'Can not be attacked or targeted until it attacks.',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active() {
        if (this.state.isActive) return false; 
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Stealth`);
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }

    public deactive() {
        const role = this.route.role;
        if (!role) return false;
        super.deactive();
    }
}