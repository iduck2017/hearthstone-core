import { actionManager, Method } from "set-piece";
import { DisposerModel } from "../rules/disposers";

export class DisposerResolver {
    private _isPending = false;
    
    private _checklist: Set<DisposerModel> = new Set()

    protected resolve() {
        let checklist = [...this._checklist];
        this._checklist.clear();
        checklist = checklist.filter(disposer => disposer.isActived)
        checklist.forEach(disposer => disposer.executeLaunch())
        checklist.forEach(disposer => disposer.finishLaunch())
    }

    public register(disposer: DisposerModel) {
        this._checklist.add(disposer)
    }

    public launch(handler: Method<void, any[]>) {
        if (this._isPending) return handler();
        this._isPending = true;
        const result = handler();
        this._isPending = false;
        this.resolve()
        return result;
    }
}

export const disposerResolver = new DisposerResolver()

export function useDisposer() { 
    return function(
        prototype: object,
        key: string,
        descriptor: PropertyDescriptor,
    ) {
        const handler = descriptor.value;
        if (!handler) return;
        descriptor.value = function(...args: any[]) {
            const _handler = handler.bind(this, ...args);
            return disposerResolver.launch(_handler);
        }
        return descriptor;
    }
}