import { useRoute, Model, useMemo, useState } from "set-piece";
import { registerDisposer, useDisposer } from "../../hooks/disposer";

export abstract class DisposerModel extends Model {

    @useState()
    private _isDestroyed: boolean = false;
    @useMemo()
    public get isDestroyed() {
        return this._isDestroyed;
    }
    @useDisposer()
    public destroy() {
        this._isDestroyed = true;
        console.log('Destroy', this.parent)
        registerDisposer(this);
    }
    
    public abstract get isActived(): boolean;

    
    public abstract run(): void;
    public abstract finishRun(): void;
}           

