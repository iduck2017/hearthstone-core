import { asRoute, Model } from "set-piece";

export abstract class DisposerModel extends Model {
    private _isDestroyed: boolean = false;
    public get isDestroyed() {
        return this._isDestroyed;
    }
    public destroy() {
        this._isDestroyed = true;
    }
    
    public abstract get isActived(): boolean;

    
    public abstract run(): void;
    public abstract finishRun(): void;
}           