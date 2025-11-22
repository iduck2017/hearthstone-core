import { Event, StateUtil, TemplUtil, TranxUtil } from "set-piece";
import { RoleActionModel } from "../../rules/role-action";
import { RoleFeatureModel } from "../role";
import { RoleActionDecor } from "../../../types/decors/role-action";

export namespace WindfuryModel {
    export type E = {};
    export type S = {
        isAdvanced: boolean;
    };
    export type C = {};
    export type R = {};
}

@TemplUtil.is('windfury')
export class WindfuryModel extends RoleFeatureModel<
    WindfuryModel.E,
    WindfuryModel.S,
    WindfuryModel.C,
    WindfuryModel.R
> {

    constructor(props?: WindfuryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Windfury',
                desc: 'Can attack twice each turn.',
                isAdvanced: false,
                isActived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(isAdvanced?: boolean) {
        // before
        if (!isAdvanced && this.state.isActived) return false;
        if (isAdvanced && this.state.isAdvanced) return false;
        super.active();
    }

    @TranxUtil.span()
    protected doActive(isAdvanced?: boolean) {
        super.doActive();
        this.origin.state.isAdvanced = isAdvanced ?? false;
    }

    @TranxUtil.span()
    protected doDeactive() {
        super.doDeactive();
        this.origin.state.isAdvanced = false;
    }

    
    @StateUtil.on(self => self.modifyAction)
    protected listenAction() { 
        return this.route.role?.proxy.child.action?.decor;
    }
    protected modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActived) return;
        decor.add(this.state.isAdvanced ? 3 : 1);
    }
}
