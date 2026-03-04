import { asState, Model } from "set-piece";

export class DivineShieldModel extends Model {
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

    public active() {
        this._isActive = true;
    }

    /** Attempt to absorb incoming damage.
     *  Returns true if the shield was consumed (damage blocked). */
    public consume(): boolean {
        if (!this._isActive) return false;
        this._isActive = false;
        return true;
    }
}
