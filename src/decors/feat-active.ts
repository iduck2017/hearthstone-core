import { Decor, Model, useDecorConsumer } from "set-piece";
import { FeatModel } from "../feats";

export class FeatActiveDecor extends Decor<boolean> {
    private _disabled = false;
    public disable() {
        this._disabled = true;
    }

    public get result(): boolean {
        return this.origin && !this._disabled;
    }
}

export function useFeatActiveDecorConsumer<I extends Model & { feat: FeatModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: FeatActiveDecor) => void>
    ) {
        useDecorConsumer((i: I) => [i.feat, FeatActiveDecor])(
            prototype,
            key,
            descriptor
        );
    }
}
