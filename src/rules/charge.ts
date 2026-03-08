import { asRoute, asState, Model } from "set-piece";
import { RoleModel } from "../entities/role";
import { BooleanDecorModel, BooleanDecorType } from "../utils/boolean-decor";

export class ChargeModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
    }

    @asRoute(() => RoleModel)
    private _role?: RoleModel;
    public get role() {
        return this._role;
    }

    @asState()
    private _isActived: boolean;
    public get isActived() {
        return this._isActived;
    }

}
