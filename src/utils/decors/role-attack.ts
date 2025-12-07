import { Decor } from "set-piece";
import { OperatorType } from "../../types/operator";
import { RoleAttackModel } from "../../models/rules/role-attack";
import { Operator } from "../../types/operator";
import { RoleAttackBuffModel } from "../../models/features/buffs/role-attack";

// Role attack decorator: applies buffs first (sorted by UUID), then other operations
export class RoleAttackDecor extends Decor<RoleAttackModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        
        // Apply buffs first (sorted by UUID for determinism)
        this.operations
            .filter(item => item.method instanceof RoleAttackBuffModel)
            .sort((a, b) => a.method.uuid.localeCompare(b.method.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result.current += item.offset;
                if (item.type === OperatorType.SET) result.current = item.offset;
            })
        
        // Apply other operations
        this.operations
            .filter(item => !(item.method instanceof RoleAttackBuffModel))
            .forEach(item => {
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