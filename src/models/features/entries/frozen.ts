import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
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
                isActived: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public overcome() {
        if (!this.origin.state.isActived) return;

        // condition check
        const role = this.route.role;
        if (!role) return false;
        if (role.child.action.state.current <= 0) return;
        if (!role.child.action.state.isEnabled) return;
        if (role.child.sleep.state.isActived) return;

        this.deactive();
    }

    protected onDeactive() {
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} Unfrozen`);

        super.deactive();
    }
}