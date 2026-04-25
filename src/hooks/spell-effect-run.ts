import { Method, Model } from "set-piece";
import { SpellEffectModel } from "../feats/spell-effect";

export const spellEffectRunRegistry: Map<Function, string[]> = new Map();

export function useSpellEffectRunHook<T extends Model>() {
    return function(
        prototype: SpellEffectModel<T>,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<Promise<void>, Array<T | undefined>>>,
    ) {
        const constructor = prototype.constructor;
        const keys = spellEffectRunRegistry.get(constructor) ?? [];
        keys.push(key);
        spellEffectRunRegistry.set(constructor, keys);
    }
}

export function getSpellEffectRunHooks(spellEffect: Model) {
    let constructor = spellEffect.constructor;
    const result: Array<(...params: Array<any>) => Promise<void>> = [];
    while (constructor) {
        const keys = spellEffectRunRegistry.get(constructor) ?? [];
        keys.forEach(key => {
            const method = Reflect.get(spellEffect, key);
            if (method instanceof Function) {
                result.push(method.bind(spellEffect));
            }
        });
        constructor = Object.getPrototypeOf(constructor);
    }
    return result;
}
