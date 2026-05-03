import { useRoute, Model, useMemo, useState } from "set-piece";
import { disposerResolver, useDisposer } from "../../utils/disposer-resolver";

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
        disposerResolver.register(this);
    }
    
    public abstract get isActived(): boolean;

    public abstract executeLaunch(): void;
    public abstract finishLaunch(): void;
}           

