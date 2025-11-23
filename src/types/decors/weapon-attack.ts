import { Decor } from "set-piece";
import { OperatorType } from "../operator";
import { WeaponAttackModel } from "../../models/rules/weapon-attack";
import { Operator } from "../operator";
import { WeaponAttackBuffModel } from "../../models/features/buffs/weapon-attack";

// Weapon attack decorator: applies buffs first (sorted by UUID), then other operations
export class WeaponAttackDecor extends Decor<WeaponAttackModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        
        // Apply buffs first (sorted by UUID for determinism)
        this.operations
            .filter(item => item.reason instanceof WeaponAttackBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result.current += item.offset;
                if (item.type === OperatorType.SET) result.current = item.offset;
            })
        
        // Apply other operations
        this.operations
            .filter(item => !(item.reason instanceof WeaponAttackBuffModel))
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

