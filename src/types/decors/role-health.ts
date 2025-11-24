import { Decor } from "set-piece";
import { Operator, OperatorType } from "../operator";
import { RoleHealthModel } from "../../models/rules/role-health";
import { RoleHealthBuffModel } from "../../models/features/buffs/role-health";

// Role health decorator: applies buffs first (sorted by UUID), then other operations
export class RoleHealthDecor extends Decor<RoleHealthModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        
        // Apply buffs first (sorted by UUID for determinism)
        this.operations
            .filter(item => item.method instanceof RoleHealthBuffModel)
            .sort((a, b) => a.method.uuid.localeCompare(b.method.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result.maximum += item.offset;
                if (item.type === OperatorType.SET) result.maximum = item.offset;
            })
        
        // Apply other operations
        this.operations
            .filter(item => !(item.method instanceof RoleHealthBuffModel))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result.maximum += item.offset;
                if (item.type === OperatorType.SET) result.maximum = item.offset;
            })
        
        if (result.maximum <= 0) result.maximum = 0;
        return result;
    }
    
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}
