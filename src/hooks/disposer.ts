import { actionManager } from "set-piece";
import { DisposerModel } from "../rules/disposers";

let isPending = false;
const disposerRegistry: DisposerModel[] = [];

export function registerDisposer(disposer: DisposerModel) {
    // console.log('Register death', disposer.parent?.name);
    disposerRegistry.push(disposer);
}

export function useDisposer() { 
    return function(
        prototype: object,
        key: string,
        descriptor: PropertyDescriptor,
    ) {
        const handler = descriptor.value;
        if (!handler) return;
        descriptor.value = function(...args: any[]) {
            if (isPending) {
                return handler.call(this, ...args);
            }
            isPending = true;
            const result = handler.call(this, ...args);
            isPending = false;
            const prevDisposerRegistry = [...disposerRegistry];
            disposerRegistry.length = 0;
            actionManager.launch(() => {
                prevDisposerRegistry.forEach(item => item.run())
            })
            prevDisposerRegistry.forEach(item => item.finishRun())
            return result;
        }
        return descriptor;
    }
}
