import { Event, TemplUtil } from "set-piece";
import { FeatureModel } from "..";
import { RoleFeatureModel } from "../role";

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
                isActive: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        this.origin.state.isActive = true;
        this.debug();
        this.event.onActive(new Event({}));
        return true;
    }

    public unfreeze() {
        if (!this.state.isActive) return;
        const role = this.route.role;
        if (!role) return false;
        if (role.child.action.state.current <= 0) return;
        if (role.child.action.state.isLock) return;
        if (role.child.sleep.state.isActive) return;
        this.deactive();
    }

    public deactive() {
        super.deactive();
    }

}