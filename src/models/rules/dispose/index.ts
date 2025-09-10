import { DebugUtil, Event, Loader, LogLevel, Method, Model, TranxUtil } from "set-piece";

export namespace DisposeProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    }
    export type S = {
        isLock: boolean;
    }
    export type C = {}
    export type R = {
        reason?: Model;
    }
}

export abstract class DisposeModel extends Model<
    DisposeProps.E,
    DisposeProps.S,
    DisposeProps.C,
    DisposeProps.R
> {
    private static _isLock = false;
    public static get isLock() {
        return DisposeModel._isLock;
    }

    private static tasks: Array<DisposeModel> = [];

    protected static add(target: DisposeModel) {
        DisposeModel.tasks.push(target);
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            isActive: state.isLock || this.check(state),
        }
    }

    public static span() {
        return function(
            prototype: unknown,
            key: string,
            descriptor: TypedPropertyDescriptor<Method>
        ): TypedPropertyDescriptor<Method> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [key](this: unknown, ...args: any[]) {
                    if (DisposeModel._isLock) return handler.call(this, ...args);
                    DisposeModel._isLock = true;
                    const result = handler.call(this, ...args);
                    if (result instanceof Promise) {
                        result.then(() => {
                            DisposeModel._isLock = false;
                            DisposeModel.end();
                        })
                    } else {
                        DisposeModel._isLock = false;
                        DisposeModel.end();
                    }
                    return result;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }

    public static end() {
        const tasks = DisposeModel.tasks.filter(item => item.state.isActive);
        DisposeModel.tasks = [];
        tasks.forEach(item => item.run());
    }

    constructor(loader?: Loader<DisposeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    isLock: false,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @TranxUtil.span()
    public active(reason: Model, isLock?: boolean) {
        if (this.state.isActive) return;
        this.draft.refer.reason = reason;
        this.draft.state.isLock = isLock ?? false;
        DisposeModel.add(this);
    }


    protected abstract check(state: DisposeProps.S): boolean;

    protected abstract run(): void;

}