import { Decor } from "set-piece"
import { RoleActionModel } from "../../models/features/rules/role-action"

export class RoleActionDecor extends Decor<RoleActionModel.S> {
    public add(value: number) { 
        this._origin.origin += value 
    }
    
    public disable() { 
        this._origin.actived = false 
    }
}