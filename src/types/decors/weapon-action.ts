import { Decor } from "set-piece";
import { Operator, OperatorType } from "../operator";
import { WeaponActionModel } from "../../models/rules/weapon-action";
import { WeaponActionkBuffModel } from "../../models/features/buffs/weapon-action";

// Weapon durability decorator: applies buffs first (sorted by UUID), then other operations
export class WeaponActionDecor extends Decor<WeaponActionModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        
        // Apply buffs first (sorted by UUID for determinism)
        this.operations
            .filter(item => item.reason instanceof WeaponActionkBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid))
            .forEach(item => {
                if (item.type === OperatorType.ADD) result.maximum += item.offset;
                if (item.type === OperatorType.SET) result.maximum = item.offset;
            })
        
        // Apply other operations
        this.operations
            .filter(item => !(item.reason instanceof WeaponActionkBuffModel))
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

