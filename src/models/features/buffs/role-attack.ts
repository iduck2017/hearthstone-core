import { FeatureModel } from "..";
import { StateUtil } from "set-piece";
import { RoleAttackModel } from "../../rules/role-attack";
import { OperatorType } from "../../../types/operator";
import { RoleAttackDecor } from "../../../types/decors/role-attack";
import { BuffModel } from ".";

export namespace RoleAttackBuffModel {
    export type S = {};
    export type E = {};
    export type C = {};
    export type R = {};
}

export class RoleAttackBuffModel extends BuffModel<
    RoleAttackBuffModel.E,
    RoleAttackBuffModel.S,
    RoleAttackBuffModel.C,
    RoleAttackBuffModel.R
> {
    constructor(props?: RoleAttackBuffModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
    
    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        const role = this.route.role;
        return role?.proxy.child.attack?.decor;
    }
    protected modifyAttack(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.state.isEnabled) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset,
            method: this,
        });
    }
}