import { Decor } from "set-piece";
import { Operator, OperatorType } from "../../types/operator";
import { CostModel } from "../../models/rules/cost";

// Cost decorator: sorts operations (SET before ADD), applies constraints at the end
export class CostDecor extends Decor<CostModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        const items = this.operations;
        
        // Extract global constraints
        const maximum = Math.min(...items
            .map(item => item.maximum)
            .filter(item => item !== undefined)
        );
        const minimum = Math.max(...items
            .map(item => item.minimum)
            .filter(item => item !== undefined)
            .concat([0])
        );
        
        // Sort: SET before ADD (SET overrides previous values)
        items.sort((a, b) => {
            if (a.type === OperatorType.SET) return -1;
            if (b.type === OperatorType.SET) return 1;
            return 0;
        })
        
        // Apply operations
        items.forEach(item => {
            if (item.type === OperatorType.ADD) result.current += item.offset;
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        
        // Apply constraints
        if (result.current < minimum) result.current = minimum;
        if (result.current > maximum) result.current = maximum;
        
        return result;
    }
    
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}