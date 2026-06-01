import { Decor, Model, useDecorConsumer } from "set-piece";
import { FeatIntf, FeatModel } from "../feats";

export class FeatActiveDecor extends Decor<boolean> {
    private _isLocked = false;

    public disable() { 
        this._isLocked = true; 
        this._result = false;
    }

    public enable() {
        if (this._isLocked) return;
        this._result = true; 
    }
}

export function useFeatActiveDecorConsumer<I extends FeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: FeatActiveDecor) => void>
    ) {
        useDecorConsumer((that: I) => {
            return [that.feat, FeatActiveDecor]
        })(prototype, key, descriptor);
    }
}