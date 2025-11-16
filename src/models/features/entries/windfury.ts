import { Event, StateUtil, TemplUtil, TranxUtil } from "set-piece";
import { RoleActionModel } from "../rules/role-action";
import { RoleFeatureModel } from "../../features/minion";
import { RoleActionDecor } from "../../../types/decors/role-action";

export namespace WindfuryModel {
    export type E = {};
    export type S = {
        advanced: boolean;
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
                advanced: false,
                actived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(advanced?: boolean): boolean {
        if (!advanced && this.state.actived) return false;
        if (this.state.actived && this.state.advanced) return false; 
        this._active(advanced);
        this.event.onEnable(new Event({}));
        return true;
    }
    @TranxUtil.span()
    private _active(advanced?: boolean) {
        this.origin.state.actived = true;
        this.origin.state.advanced = advanced ?? false;
    }

    @StateUtil.on(self => self.modifyAction)
    private listenAction() { 
        return this.route.role?.proxy.child.action?.decor;
    }
    protected modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.actived) return;
        decor.add(this.state.advanced ? 3 : 1);
    }


    @TranxUtil.span()
    public disable() {
        super.disable();
        this.origin.state.advanced = false;
    }
}
