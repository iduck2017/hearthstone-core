import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../../features/minion";

export namespace FrozenModel {
    export type E = {}
    export type S = {}
    export type C = {}
}

@TemplUtil.is('frozen')
export class FrozenModel extends RoleFeatureModel<
    FrozenModel.E,
    FrozenModel.S,
    FrozenModel.C
> {
    constructor(props?: FrozenModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Frozen',
                desc: 'Frozen charactoers lose their next attack.',
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
        DebugUtil.log(`${role.name} Frozen`);
        this.origin.state.actived = true;
        this.event.onEnable(new Event({}));
        return true;
    }

    public unfreeze() {
        if (!this.state.actived) return;
        const role = this.route.role;
        if (!role) return false;
        if (role.child.action.state.current <= 0) return;
        if (!role.child.action.state.actived) return;
        if (role.child.sleep.state.actived) return;
        this.disable();
    }

    public disable() {
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} Unfrozen`);
        super.disable();
    }

}