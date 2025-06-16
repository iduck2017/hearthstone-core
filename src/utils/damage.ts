import { RoleModel } from "@/common/role";

export class Damage {
    public readonly target: RoleModel;
    
    private readonly _source: RoleModel[];

    constructor(target: RoleModel, source: RoleModel[]) {
        this.target = target;
        this._source = source;
    }
}