import { DebugUtil, Event, TemplUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../role";
import { RoleModel } from "../../entities/heroes";

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
    public static enable(targets: RoleModel[]) {
        targets = targets.filter(item => {
            const entry = item.child.frozen;
            const isValid = entry.toEnable()
            return isValid
        })
        this.doEnable(targets)
        targets.forEach(item => {
            const entry = item.child.frozen;
            entry.onEnable();
        })
    }

    @TranxUtil.then()
    private static doEnable(target: RoleModel[]) {
        target.forEach(item => {
            const entry = item.child.frozen;
            entry.doEnable();
        })
    }

    constructor(props?: FrozenModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Frozen',
                desc: 'Frozen charactoers lose their next attack.',
                isEnabled: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public reset() {
        if (!this.origin.state.isEnabled) return;

        // condition check
        const role = this.route.role;
        if (!role) return false;
        if (role.child.action.state.current <= 0) return;
        if (!role.child.action.state.isEnabled) return;
        if (role.child.sleep.state.isActived) return;

        this.disable();
    }

    protected onDeactive() {
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} Unfrozen`);

        super.disable();
    }
}