import { Method, Model } from "set-piece";
import { FeatureModel } from "../features";

export const featDeactiveRegistry: Map<Function, string[]> = new Map();

export function useFeatDeactiveHook() {
    return function(
        prototype: Model,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<void, []>>,
    ) {
        const constructor = prototype.constructor;
        const keys = featDeactiveRegistry.get(constructor) ?? [];
        keys.push(key);
        featDeactiveRegistry.set(constructor, keys);
    }
}

export function getFeatDeactiveHooks(feat: Model) {
    let constructor = feat.constructor;
    const result: Array<() => void> = [];
    while (constructor) {
        const keys = featDeactiveRegistry.get(constructor) ?? [];
        keys.forEach(key => {
            const method = Reflect.get(feat, key);
            if (method instanceof Function) {
                result.push(method.bind(feat));
            }
        });
        constructor = Object.getPrototypeOf(constructor);
    }
    return result;
}