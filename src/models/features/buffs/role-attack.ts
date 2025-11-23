import { FeatureModel } from "..";
import { BuffAggregationModel } from "./aggregation";
import { StateUtil } from "set-piece";
import { RoleAttackModel } from "../../rules/role-attack";
import { OperatorType } from "../../../types/operator";
import { RoleAttackDecor } from "../../../types/decors/role-attack";

export namespace RoleAttackBuffModel {
    export type E = {};
    export type S = {
        offset: number;
    };
    export type C = {};
    export type R = {};
}

export class RoleAttackBuffModel extends FeatureModel<
    RoleAttackBuffModel.E,
    RoleAttackBuffModel.S,
    RoleAttackBuffModel.C,
    RoleAttackBuffModel.R
> {
    constructor(props: RoleAttackBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                offset: 0,
                name: 'Role Attack Buff',
                desc: "",
                isEnabled: true,
                ...props.state 
            },
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
            reason: this,
        });
    }
}