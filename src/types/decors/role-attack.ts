import { Decor } from "set-piece";
import { OperatorType } from "../operator";
import { RoleAttackModel } from "../../models/features/rules/role-attack";
import { Operator } from "../operator";
import { IRoleBuffModel } from "../../models/features/rules/i-role-buff";

export class RoleAttackDecor extends Decor<RoleAttackModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        // buff
        const buffs = this.operations
            .filter(item => item.reason instanceof IRoleBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid));
        buffs.forEach(item => {
            if (item.type === OperatorType.ADD) result.current += item.offset;
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        const feats = this.operations.filter(item => !(item.reason instanceof IRoleBuffModel));
        feats.forEach(item => {
            if (item.type === OperatorType.ADD) result.current += item.offset;
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        if (result.current <= 0) result.current = 0;
        return result;
    }
    
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}