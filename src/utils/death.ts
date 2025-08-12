import { Callback } from "set-piece";
import { RoleModel } from "../model/role";

export class DeathUtil {
    private static _isLock = false;
    public static get isLock() {
        return DeathUtil._isLock;
    }

    private static tasks: Array<RoleModel> = [];

    public static add(task: RoleModel) {
        DeathUtil.tasks.push(task);
    }

    public static span() {
        return function(
            prototype: unknown,
            key: string,
            descriptor: TypedPropertyDescriptor<Callback>
        ): TypedPropertyDescriptor<Callback> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [key](this: unknown, ...args: any[]) {
                    if (DeathUtil._isLock) return handler.call(this, ...args);
                    DeathUtil._isLock = true;
                    const result = handler.call(this, ...args);
                    if (result instanceof Promise) {
                        result.then(() => {
                            DeathUtil._isLock = false;
                            DeathUtil.end();
                        })
                    } else {
                        DeathUtil._isLock = false;
                        DeathUtil.end();
                    }
                    return result;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }

    public static end() {
        const tasks = DeathUtil.tasks.filter(item => item.state.isDead);
        // console.log('death tranx', tasks)
        DeathUtil.tasks = [];
        tasks.forEach(item => item.route.card?.dispose());
        tasks.forEach(item => item.onDie());
    }

    private constructor() {}
}