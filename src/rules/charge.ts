import { asState, Model } from "set-piece";

export class ChargeModel extends Model {
    constructor(props?: {
        isActive?: boolean;
    }) {
        super();
        this._isActive = props?.isActive ?? false;
    }

    @asState()
    private _isActive: boolean;
    public get isActive() {
        return this._isActive;
    }
}
