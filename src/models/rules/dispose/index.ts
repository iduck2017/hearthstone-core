import { DebugUtil, Event, Loader, LogLevel, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, GraveyardModel, HeroModel, MinionCardModel, PlayerModel, SecretCardModel, WeaponCardModel } from '../../..'

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
        source?: CardModel | HeroModel;
    }
    export type P = {
        player: PlayerModel;
    }
}

export abstract class DisposeModel<
    E extends Props.E & Partial<DisposeProps.E> = {},
    S extends Props.S & Partial<DisposeProps.S> = {},
    C extends Props.C & Partial<DisposeProps.C> = {},
    R extends Props.R & Partial<DisposeProps.R> = Props.R,
    P extends Props.P & Partial<DisposeProps.P> = {}
> extends Model<
    E & DisposeProps.E,
    S & DisposeProps.S,
    C & DisposeProps.C,
    R & DisposeProps.R,
    P & DisposeProps.P
> {
    private static _isLock = false;
    public static get isLock() {
        return DisposeModel._isLock;
    }

    private static tasks: Array<DisposeModel> = [];

    protected static add(target: DisposeModel) {
        DisposeModel.tasks.push(target);
    }

    public get status() {
        return Boolean(this.state.isLock);
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
        const tasks = DisposeModel.tasks.filter(item => item.status);
        DisposeModel.tasks = [];
        tasks.forEach(item => item.run());
    }

    constructor(loader: Method<DisposeModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
        route: P;
    }, []>) {
        super(() => {
            const props = loader() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    isLock: false,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    player: PlayerModel.prototype,
                    ...props.route,
                },
            }
        });
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public active(isLock?: boolean, source?: CardModel | HeroModel, reason?: Model) {
        if (this.status) return;
        this.draft.refer.reason = reason;
        this.draft.refer.source = source;
        this.draft.state.isLock = isLock ?? false;
        DisposeModel.add(this);
    }

    protected abstract run(): void;

}