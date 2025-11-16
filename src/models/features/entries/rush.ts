import { DebugUtil, Event, TemplUtil } from "set-piece";
import { RoleFeatureModel } from "../../features/minion";

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
                actived: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public active(): boolean {
        if (this.state.actived) return false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Rush`);
        this.origin.state.actived = true;
        this.event.onEnable(new Event({}));
        return true;
    }
}