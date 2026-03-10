import { CustomDecor, Model, useModifier } from "set-piece";
import { RoleModel } from "../entities/role";
import { RoleActionModel } from "../rules/role-action";

export class SleepDecor extends CustomDecor<boolean> {}

export function onSleepStatusCalc<I extends Model>(
    selector: (self: I) => RoleModel | undefined
) {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(model: RoleActionModel, decor: SleepDecor) => void>
    ) {
        useModifier<I, RoleActionModel, SleepDecor>(() => [SleepDecor, RoleModel, RoleActionModel])(
            prototype,
            key,
            descriptor
        );
        const method = descriptor.value;
        if (!method) return;  
        descriptor.value = function(this: I, target: RoleActionModel, decor: SleepDecor) {
            const role = selector(this);
            if (role !== target.role) return;
            method.call(this, target, decor);
        }
    }
}
