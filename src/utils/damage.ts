import { Callback, EventUtil, TranxUtil } from "set-piece";
import { DeathUtil } from "./death";
import { RoleModel } from "../model/role";
import { CardModel } from "../model/card";

export type DamageProvider = {
    target: RoleModel;
    source?: CardModel;
    damage: number;
    dealDamage: number;
    isAttack: boolean;
}

export type DamageConsumer = DamageProvider & {
    prevState: RoleModel['props'];
    nextState: RoleModel['props'];
    recvDamage: number;
    isDevineShield: boolean;
}

export class DamageUtil {
    private constructor() {}

    private static _isLock = false;
    public static get isLock() {
        return this._isLock;
    }

    private static queue: DamageConsumer[] = [];

    @EventUtil.span()
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
                            DamageUtil.end();
                        })
                    } else {
                        DamageUtil._isLock = false;
                        DamageUtil.end();
                    }
                    return result;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }

    @TranxUtil.span()
    private static run(queue: DamageProvider[]) {
        const result: DamageConsumer[] = queue.map(item => {
            return item.target.recvDamage(item)
        })
        DamageUtil.queue.push(...result);
        return result;
    }

    private static end() {
        const queue = [...DamageUtil.queue];
        DamageUtil.queue = [];
        queue.forEach(item => {
            item.target.onRecvDamage(item);
            item.source?.onDealDamage(item);
        })
    }
}