import { Decor } from "set-piece";
import { Operator, OperatorType } from "../operator";
import { CostModel } from "../../models/rules/cost";

/**
 * CostDecor - Decorator pattern for calculating card cost with multiple operations
 * 
 * This decorator applies a series of cost modification operations (ADD/SET) in a specific order
 * to calculate the final cost of a card. The execution follows a simplified approach:
 * 
 * Process:
 * 1. Extract global maximum and minimum constraints from all operations
 * 2. Sort operations: SET operations prioritized over ADD operations
 * 3. Execute all operations sequentially (ADD adds offset, SET assigns value)
 * 4. Apply global constraints as final clamp to ensure result is within bounds
 * 
 * Key Design:
 * - Operations are executed without individual constraint checking during execution
 * - All constraints are applied at the end as a global safety check
 * - This simplifies the logic while ensuring final result respects all limits
 */
export class CostDecor extends Decor<CostModel.S> {

    /**
     * Collection of all cost modification operations to be applied
     * Each operation can be ADD (increment/decrement) or SET (direct assignment)
     * Operations may have optional maximum/minimum constraints
     */
    private operations: Operator[] = [];

    /**
     * Calculates the final cost by applying all operations in the correct order
     * 
     * The calculation process:
     * 1. Extract global maximum and minimum from all operations' constraints
     * 2. Sort operations: SET before ADD (SET operations override previous values)
     * 3. Execute all operations sequentially without constraint checking
     * 4. Apply global constraints as final clamp
     * 
     * @returns The final cost state with current value calculated from all operations
     */
    public get result() {
        // Start with the original cost state
        const result = { ...this._origin };
        const items = this.operations;
        
        // Extract the global maximum constraint from all operations
        // Maps each operation to its maximum value, filters out undefined, then finds the max
        // If no operations have a maximum, Math.max(...[]) returns -Infinity
        // This will be handled in the final clamp step
        const maximum = Math.min(...items
            .map(item => item.maximum)
            .filter(item => item !== undefined)
        );
        
        // Extract the global minimum constraint from all operations
        // Maps each operation to its minimum value, filters out undefined, then adds 0 as default
        // The 0 ensures costs cannot be negative (game rule)
        // If no operations have a minimum, Math.min will return 0 (from concat([0]))
        const minimum = Math.max(...items
            .map(item => item.minimum)
            .filter(item => item !== undefined)
            .concat([0])
        );
        
        // Sort: Prioritize SET operations over ADD operations
        // SET operations directly assign a value and should override incremental changes
        // Rationale: Direct assignments take precedence over incremental modifications
        // Note: ADD operation order doesn't matter due to addition commutativity
        // and final global constraint clamping, so we only need to prioritize SET
        items.sort((a, b) => {
            // SET operations come first (they override previous values)
            if (a.type === OperatorType.SET) return -1;
            if (b.type === OperatorType.SET) return 1;
            // ADD operations maintain their original order (order doesn't affect final result)
            return 0;
        })
        
        // Execute all operations in the sorted order
        // Operations are applied sequentially without checking individual constraints
        // All constraint checking is deferred to the final clamp step
        items.forEach(item => {
            if (item.type === OperatorType.ADD) {
                // ADD operation: increment/decrement the current cost by offset
                // No constraint checking here - constraints applied at the end
                result.current += item.offset;
            }
            if (item.type === OperatorType.SET) {
                // SET operation: directly assign the offset as the new cost value
                // This overrides any previous calculations
                result.current = item.offset;
            }
        })
        
        // Final clamp: Apply global constraints to ensure result is within bounds
        // This ensures the final cost respects all maximum/minimum limits from all operations
        // If maximum is -Infinity (no operations had maximum), the > check will always be false
        // If minimum is 0 (default), this ensures costs cannot be negative
        if (result.current < minimum) result.current = minimum;
        if (result.current > maximum) result.current = maximum;
        
        return result;
    }
    
    /**
     * Adds a cost modification operation to the collection
     * Operations will be applied in the calculated order when result is accessed
     * 
     * @param operation - The cost modification operation to add
     */
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}