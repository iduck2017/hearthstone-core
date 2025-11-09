import { Decor, Event, StateUtil, TemplUtil, TranxUtil } from "set-piece";
import { RoleActionModel, RoleActionDecor } from "../../rules/role/action";
import { RoleFeatureModel } from "../role";

export namespace WindfuryModel {
    export type E = {};
    export type S = {
        isAdvance: boolean;
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
                isAdvance: false,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(isAdvance?: boolean): boolean {
        if (!isAdvance && this.state.isActive) return false;
        if (this.state.isActive && this.state.isAdvance) return false; 
        this.doActive(isAdvance);
        this.event.onActive(new Event({}));
        return true;
    }

    @TranxUtil.span()
    private doActive(isAdvance?: boolean) {
        this.origin.state.isActive = true;
        this.origin.state.isAdvance = isAdvance ?? false;
    }

    @StateUtil.on(self => self.modifyAction)
    private listenAction() { 
        return this.route.role?.proxy.child.action?.decor;
    }
    protected modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.add(this.state.isAdvance ? 3 : 1);
    }

    @TranxUtil.span()
    public deactive() {
        super.deactive();
        this.origin.state.isAdvance = false;
    }
}
