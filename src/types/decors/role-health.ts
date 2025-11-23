import { Decor } from "set-piece";
import { Operator, OperatorType } from "../operator";
import { RoleHealthModel } from "../../models/rules/role-health";
import { RoleHealthBuffModel } from "../../models/features/buffs/role-health";

export class RoleHealthDecor extends Decor<RoleHealthModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        // buff
        this.operations
            .filter(item => item.reason instanceof RoleHealthBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result.maximum += item.offset;
                if (item.type === OperatorType.SET) result.maximum = item.offset;
            })
        this.operations
            .filter(item => !(item.reason instanceof RoleHealthBuffModel))
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
