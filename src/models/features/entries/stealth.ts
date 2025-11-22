import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../../features/minion";

export namespace StealthModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@TemplUtil.is('stealth')
export class StealthModel extends RoleFeatureModel<
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
                isActived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active() {
        // before
        if (this.origin.state.isActived) return;
        const role = this.route.role;
        if (!role) return;

        // execute
        this.origin.state.isActived = true;
        // after
        DebugUtil.log(`${role.name} gain Stealth`);
        this.event.onActive(new Event({}));
    }
}