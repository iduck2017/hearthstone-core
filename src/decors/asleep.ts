import { CustomDecor, Model, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";

export class AsleepDecor extends CustomDecor<boolean> {}

export function useAsleepDecorConsumer<I extends Model & { role?: RoleModel }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: AsleepDecor) => void>
    ) {
        useDecorConsumer((i: I) => [i.role?.action, AsleepDecor])(
            prototype,
            key,
            descriptor
        );
    }
}
