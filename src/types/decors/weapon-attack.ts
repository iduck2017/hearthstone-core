import { Decor } from "set-piece";
import { OperatorType } from "../operator";
import { WeaponAttackModel } from "../../models/rules/weapon-attack";
import { Operator } from "../operator";

/**
 * WeaponAttackDecor - Decorator pattern for calculating weapon attack with multiple operations
 * 
 * This decorator applies a series of attack modification operations (ADD/SET) in a specific order
 * to calculate the final attack value of a weapon. The execution follows a two-phase approach:
 * 
 * Execution Order:
 * 1. Buff operations (from IWeaponBuffModel) - executed first, sorted by UUID for determinism
 * 2. Non-buff operations - executed after buff operations
 * 3. Final safety check - ensure attack is never negative
 * 
 * Key Design:
 * - Buff operations are separated and executed first to ensure consistent behavior
 * - Buff operations are sorted by UUID to guarantee deterministic execution order
 * - Non-buff operations (temporary effects, etc.) are applied after buffs
 * - This separation ensures permanent buffs are applied before temporary modifications
 */
export class WeaponAttackDecor extends Decor<WeaponAttackModel.S> {
    /**
     * Collection of all attack modification operations to be applied
     * Each operation can be ADD (increment/decrement) or SET (direct assignment)
     * Operations may come from buffs (IWeaponBuffModel) or other sources
     */
    private operations: Operator[] = [];

    /**
     * Calculates the final attack by applying all operations in the correct order
     * 
     * The calculation process:
     * 1. Apply buff operations first (from IWeaponBuffModel), sorted by UUID for determinism
     * 2. Apply non-buff operations after buffs
     * 3. Ensure final attack is never negative
     * 
     * Rationale for two-phase execution:
     * - Buffs are permanent modifications that should be applied first
     * - Non-buff operations (temporary effects, conditional modifiers) are applied after
     * - UUID sorting ensures consistent behavior when multiple buffs are present
     * 
     * @returns The final attack state with current value calculated from all operations
     */
    // public get result() {
    //     // Start with the original attack state
    //     const result = { ...this._origin };
        
    //     // Phase 1: Apply buff operations (from IWeaponBuffModel)
    //     // Buffs are permanent modifications that should be applied first
    //     // They are sorted by UUID to ensure deterministic execution order
    //     // This is important for game consistency and reproducibility
    //     this.operations
    //         // Filter to only include operations from buff sources
    //         .filter(item => item.reason instanceof IWeaponBuffModel)
    //         // Sort by UUID to ensure deterministic order when multiple buffs are present
    //         // This guarantees that the same set of buffs always produces the same result
    //         .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid))
    //         // Execute each buff operation
    //         .forEach(item => {
    //             if (item.type === OperatorType.ADD) {
    //                 // ADD operation: increment/decrement the current attack by offset
    //                 result.current += item.offset;
    //             }
    //             if (item.type === OperatorType.SET) {
    //                 // SET operation: directly assign the offset as the new attack value
    //                 // This overrides any previous calculations
    //                 result.current = item.offset;
    //             }
    //         })
        
    //     // Phase 2: Apply non-buff operations
    //     // These are temporary effects, conditional modifiers, or other non-permanent changes
    //     // They are applied after buffs to ensure they can modify the buffed value
    //     this.operations
    //         // Filter to exclude buff operations (only include non-buff operations)
    //         .filter(item => !(item.reason instanceof IWeaponBuffModel))
    //         // Execute each non-buff operation
    //         // Note: No sorting is applied here - operations are executed in their original order
    //         .forEach(item => {
    //             if (item.type === OperatorType.ADD) {
    //                 // ADD operation: increment/decrement the current attack by offset
    //                 result.current += item.offset;
    //             }
    //             if (item.type === OperatorType.SET) {
    //                 // SET operation: directly assign the offset as the new attack value
    //                 // This overrides any previous calculations (including buffs)
    //                 result.current = item.offset;
    //             }
    //         })
        
    //     // Final safety check: ensure attack is never negative
    //     // This is a game rule: attack values cannot be negative
    //     // If the result is 0 or negative, it is clamped to 0
    //     if (result.current <= 0) result.current = 0;
        
    //     return result;
    // }
    
    /**
     * Adds an attack modification operation to the collection
     * Operations will be applied in the calculated order when result is accessed
     * 
     * @param operation - The attack modification operation to add
     */
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}

