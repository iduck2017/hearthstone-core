import { Callback, TranxUtil } from "set-piece";
import { DamageReq, DamageRes } from "../types/request";

export class DamageUtil {
    private constructor() {}

    private static _isLock = false;
    public static get isLock() {
        return this._isLock;
    }

    private static queue: DamageRes[] = [];

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
                    if (DamageUtil._isLock) {
                        return handler.call(this, ...args);
                    }
                    DamageUtil._isLock = true;
                    const result = handler.call(this, ...args);
                    if (result instanceof Promise) {
                        result.then(() => {
                            DamageUtil._isLock = false;
                            DamageUtil.close();
                        })
                    } else {
                        DamageUtil._isLock = false;
                        DamageUtil.close();
                    }
                    return result;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }

    @DamageUtil.span()
    public static run(queue: DamageReq[]) {
        queue.forEach(item => {
            item.source?.toDealDamage(item);
            item.target.toRecvDamage(item);
        })
        DamageUtil._run(queue);
    }

    @TranxUtil.span()
    private static _run(queue: DamageReq[]) {
        const result: DamageRes[] = queue.map(item => {
            return item.target.recvDamage(item)
        })
        DamageUtil.queue.push(...result);
        return result;
    }

    private static close() {
        const queue = [...DamageUtil.queue];
        DamageUtil.queue = [];
        queue.forEach(item => {
            item.target.onRecvDamage(item);
            item.source?.onDealDamage(item);
        })
    }
}