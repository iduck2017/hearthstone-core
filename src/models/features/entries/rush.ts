import { DebugUtil, Event, TemplUtil } from "set-piece";
import { RoleFeatureModel } from "../role";

export namespace RushModel {
    export type E = {};
    export type S = {}
    export type C = {};
    export type R = {};
}

@TemplUtil.is('rush')
export class RushModel extends RoleFeatureModel<
    RushModel.E,
    RushModel.S,
    RushModel.C,
    RushModel.R
> {
    constructor(props?: RushModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Rush',
                desc: 'Can attack minions immediately.',
                isEnabled: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public enable() {
        // `before`
        if (this.state.isEnabled) return false;
        const role = this.route.role;
        if (!role) return false;

        // execute
        this.origin.state.isEnabled = true;
        // after
        DebugUtil.log(`${role.name} gain Rush`);
        this.event.onActive(new Event({}));
    }
}