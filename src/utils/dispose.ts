import { Model } from "set-piece";
import { CardModel } from "../entities/card";

let isPending = false;

const disposerRegistry: CardModel[] = [];
export function registerDisposer(minion: CardModel) {
    console.log('Register death', minion);
    disposerRegistry.push(minion);
}

export function useCardDisposer() { 
    return function(
        prototype: object,
        key: string,
        descriptor: PropertyDescriptor,
    ) {
        const method = descriptor.value;
        if (!method) return;
        descriptor.value = function(...args: any[]) {
            if (isPending) {
                return method.call(this, ...args);
            }
            isPending = true;
            const result = method.call(this, ...args);
            isPending = false;
            disposerRegistry.forEach(card => card.dispose())
            return result;
        }
    }
}
