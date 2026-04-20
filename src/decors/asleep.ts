import { CustomDecor, Model, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";
import { RoleActionModel } from "../rules/role-action";

export class AsleepDecor extends CustomDecor<boolean> {}

export function useAsleepDecorConsumer<I extends Model & { role?: RoleModel }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: AsleepDecor, target: RoleActionModel) => void>
    ) {
        useDecorConsumer((i: I) => [i.role?.action, AsleepDecor])(
            prototype,
            key,
            descriptor
        );
        const handler = descriptor.value;
        if (!handler) return;  
        descriptor.value = function(this: I,  decor: AsleepDecor, target: RoleActionModel) {
            handler.call(this, decor, target);
        }
        return descriptor;
    }
}
