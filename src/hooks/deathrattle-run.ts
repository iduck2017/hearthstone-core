import { Method, Model } from "set-piece";
import { DeathrattleModel } from "../features/deathrattle";

export const deathrattleRunRegistry: Map<Function, string[]> = new Map();

export function useDeathrattleRunHook() {
    return function(
        prototype: DeathrattleModel,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<void, []>>,
    ) {
        const constructor = prototype.constructor;
        const keys = deathrattleRunRegistry.get(constructor) ?? [];
        keys.push(key);
        deathrattleRunRegistry.set(constructor, keys);
    }
}

export function getDeathrattleRunHooks(deathrattle: Model) {
    let constructor = deathrattle.constructor;
    const result: Array<() => void> = [];
    while (constructor) {
        const keys = deathrattleRunRegistry.get(constructor) ?? [];
        keys.forEach(key => {
            const method = Reflect.get(deathrattle, key);
            if (method instanceof Function) {
                result.push(method.bind(deathrattle));
            }
        });
        constructor = Object.getPrototypeOf(constructor);
    }
    return result;
}
