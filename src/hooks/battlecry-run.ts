import { Method, Model } from "set-piece";
import { BattlecryModel } from "../feats/battlecry";

export const battlecryRunRegistry: Map<Function, string[]> = new Map();

export function useBattlecryRunHook<T extends Model>() {
    return function(
        prototype: BattlecryModel<T>,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<Promise<void>, Array<T | undefined>>>,
    ) {
        const constructor = prototype.constructor;
        const keys = battlecryRunRegistry.get(constructor) ?? [];
        keys.push(key);
        battlecryRunRegistry.set(constructor, keys);
    }
}

export function getBattlecryRunHooks(battlecry: Model) {
    let constructor = battlecry.constructor;
    const result: Array<(...params: Array<any>) => Promise<void>> = [];
    while (constructor) {
        const keys = battlecryRunRegistry.get(constructor) ?? [];
        keys.forEach(key => {
            const method = Reflect.get(battlecry, key);
            if (method instanceof Function) {
                result.push(method.bind(battlecry));
            }
        });
        constructor = Object.getPrototypeOf(constructor);
    }
    return result;
}
