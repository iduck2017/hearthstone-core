import { Event, StatePlugin, ChunkService, TranxService } from "set-piece";
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

@ChunkService.is('windfury')
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
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public enable(isAdvanced?: boolean) {
        // before
        if (!isAdvanced && this.state.isEnabled) return false;
        if (isAdvanced && this.state.isAdvanced) return false;
        super.enable();
    }

    @TranxService.span()
    protected doEnable(isAdvanced?: boolean) {
        super.doEnable();
        this.origin.state.isAdvanced = isAdvanced ?? false;
    }

    @TranxService.span()
    protected doDisable() {
        super.doDisable();
        this.origin.state.isAdvanced = false;
    }

    
    @StatePlugin.on(self => self.modifyAction)
    protected listenAction() { 
        return this.route.role?.proxy.child.action?.decor;
    }
    protected modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isEnabled) return;
        decor.add(this.state.isAdvanced ? 3 : 1);
    }
}
