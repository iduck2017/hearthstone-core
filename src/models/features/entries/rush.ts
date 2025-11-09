import { DebugUtil, Event, TemplUtil } from "set-piece";
import { MinionFeatureModel } from "../minion";

export namespace RushModel {
    export type E = {};
    export type S = {}
    export type C = {};
    export type R = {};
}

@TemplUtil.is('rush')
export class RushModel extends MinionFeatureModel<
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
                isActive: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Rush`);
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }
}