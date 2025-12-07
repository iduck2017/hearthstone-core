import { Decor } from "set-piece";
import { Operator, OperatorType } from "../../types/operator";
import { RoleHealthModel } from "../../models/rules/role-health";
import { RoleHealthBuffModel } from "../../models/features/buffs/role-health";

// Role health decorator: applies buffs first (sorted by UUID), then other operations
export class RoleHealthDecor extends Decor<RoleHealthModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        result.maximum = this.maximum;
        result.minimum = this.minimum;
        return result;
    }

    private get minimum() {
        const operations = this.operations
            .filter(item => item.key === RoleHealthDecor.MINIMUM || !item.key)

        if (
            this._origin.minimum === undefined && 
            !operations.length
        ) return undefined;
        
        let result = this._origin.minimum ?? 0;
        // Apply buffs first (sorted by UUID for determinism)
        operations
            .filter(item => item.method instanceof RoleHealthBuffModel)
            .sort((a, b) => a.method.uuid.localeCompare(b.method.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result += item.offset;
                if (item.type === OperatorType.SET) result = item.offset;
            })
        
        // Apply other operations
        operations
            .filter(item => !(item.method instanceof RoleHealthBuffModel))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result += item.offset;
                if (item.type === OperatorType.SET) result = item.offset;
            })
        
        return result;
    }


    private get maximum() {
        let result = this._origin.maximum 
        const operations = this.operations.filter(item => (
            item.key === RoleHealthDecor.MAXIMUM || !item.key
        ))
           
        // Apply buffs first (sorted by UUID for determinism)
        operations
            .filter(item => item.method instanceof RoleHealthBuffModel)
            .sort((a, b) => a.method.uuid.localeCompare(b.method.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result += item.offset;
                if (item.type === OperatorType.SET) result = item.offset;
            })
        
        // Apply other operations
        operations
            .filter(item => !(item.method instanceof RoleHealthBuffModel))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result += item.offset;
                if (item.type === OperatorType.SET) result = item.offset;
            })
        
        if (result <= 0) result = 0;
        return result;
    }


    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}

export namespace RoleHealthDecor {
    export const MAXIMUM = 'maximum';
    export const MINIMUM = 'minimum';
}