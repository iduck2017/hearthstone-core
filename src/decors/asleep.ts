import { Decor, Model, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";
import { RoleFeatModel } from "../feats";

export class AsleepDecor extends Decor<boolean> {
    public wakeup() { this._result = false }
}

export function useAsleepDecorConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: AsleepDecor) => void>
    ) {
        useDecorConsumer((that: I) => {
            if (!that.feat?.isActived) return;
            const action = that.role?.action;
            return [action, AsleepDecor]
        })(prototype, key, descriptor );
    }
}
