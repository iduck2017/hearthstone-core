import { asState, Model } from "set-piece";

export class ChargeModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
    }

    @asState()
    private _isActived: boolean;
    public get isActived() {
        return this._isActived;
    }

    public active() {
        this._isActived = true;
    }

    public deactivate() {
        this._isActived = false;
    }
}
