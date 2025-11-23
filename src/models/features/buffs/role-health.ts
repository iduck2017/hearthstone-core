import { FeatureModel } from "..";
import { StateUtil } from "set-piece";
import { RoleHealthModel } from "../../rules/role-health";
import { RoleHealthDecor } from "../../../types/decors/role-health";
import { OperatorType } from "../../../types/operator";
import { BuffModel } from ".";

export namespace RoleHealthBuffModel {
    export type S = {};
    export type E = {};
    export type C = {};
    export type R = {};
}

export class RoleHealthBuffModel extends BuffModel<
    RoleHealthBuffModel.E,
    RoleHealthBuffModel.S,
    RoleHealthBuffModel.C,
    RoleHealthBuffModel.R
> {
    constructor(props?: RoleHealthBuffModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
    
    @StateUtil.on(self => self.modifyHealth)
    private listenHealth() {
        const role = this.route.role;
        return role?.proxy.child.health?.decor;
    }
    protected modifyHealth(that: RoleHealthModel, decor: RoleHealthDecor) {
        if (!this.state.isEnabled) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset,
            reason: this,
        });
    }

}