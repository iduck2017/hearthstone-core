import { Decor, Model, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";

export class ChargeActiveDecor extends Decor<boolean> {
    private _isActived = false;

    /** Temporarily activate Charge as a reactive aura (does not mutate ChargeModel state). */
    public active() {
        this._isActived = true;
    }

    public get result(): boolean {
        if (this._isActived) return true
        return this.origin;
    }
}

/**
 * Subscribes to the ChargeActiveDecor on the role's ChargeModel.
 * Set `decor.result = true` inside the handler to temporarily activate Charge
 * as a reactive aura (no permanent state mutation on ChargeModel).
 */
export function useChargeActiveFlagDecorConsumer<I extends Model & { role?: RoleModel }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: ChargeActiveDecor) => void>
    ) {
        useDecorConsumer((i: I) => [i.role?.charge, ChargeActiveDecor])(
            prototype,
            key,
            descriptor
        );
    }
}
