import { Callback } from "set-piece";
import { MinionCardModel } from "../model/card/minion";
import { HeroCardModel } from "../model/card/hero";

export class DeathUtil {
    private static _isLock = false;
    public static get isLock() {
        return DeathUtil._isLock;
    }

    private static queue: Array<MinionCardModel | HeroCardModel> = [];

    public static check(card: MinionCardModel | HeroCardModel) {
        DeathUtil.queue.push(card);
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
                    if (DeathUtil._isLock) {
                        return handler.call(this, ...args);
                    }
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
        this.queue.forEach(card => {
            const role = card.child.role;
            if (!role) return;
            const death = role.child.death;
            if (!death.state.isDead) return;
        })
    }
}