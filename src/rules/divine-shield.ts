import { asState, Model } from "set-piece";

export class DivineShieldModel extends Model {
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

    public restore() {
        this._isActived = true;
    }

    public consume() {
        this._isActived = false;
    }
}
