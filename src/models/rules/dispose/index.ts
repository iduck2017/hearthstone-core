import { DebugUtil, Event, Method, Model, State, TranxUtil } from "set-piece";
import { AbortEvent, BoardModel, CardModel, GraveyardModel, HeroModel, PlayerModel } from '../../..'

export namespace DisposeModel {
    export type E = {
        toDispose: Event;
        onDispose: Event;
        onDestroy: Event;
        toDestroy: AbortEvent;
    }
    export type S = {
        isDestroyed: boolean;
    }
    export type C = {}
    export type R = {
        reason?: Model;
        source?: CardModel | HeroModel;
    }
}

export abstract class DisposeModel<
    E extends Partial<DisposeModel.E> & Model.E = {},
    S extends Partial<DisposeModel.S> & Model.S = {},
    C extends Partial<DisposeModel.C> & Model.C = {},
    R extends Partial<DisposeModel.R> & Model.R = {}
> extends Model<
    E & DisposeModel.E,
    S & DisposeModel.S,
    C & DisposeModel.C,
    R & DisposeModel.R
> {
    private static _isLock = false;
    public static get isLock() {
        return DisposeModel._isLock;
    }

    private static tasks: Array<DisposeModel> = [];

    protected static add(target: DisposeModel) {
        if (DisposeModel.tasks.includes(target)) return;
        DisposeModel.tasks.push(target);
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
                            DisposeModel.close();
                        })
                    } else {
                        DisposeModel._isLock = false;
                        DisposeModel.close();
                    }
                    return result;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }
    
    public static close() {
        const tasks = DisposeModel.tasks.filter(item => item.state.isActived);
        DisposeModel.tasks = [];
        tasks.forEach(item => item.run());
    }

    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            board: result.items.find(item => item instanceof BoardModel),
            graveyard: result.items.find(item => item instanceof GraveyardModel),
        }
    }

    public get state() {
        const result = super.state;
        return {
            ...result,
            isActived: this.isActived,
        }
    }

    protected get isActived(): boolean {
        return this.state.isDestroyed;
    }

    constructor(props: DisposeModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isDestroyed: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    public destroy(source?: CardModel | HeroModel, reason?: Model) {
        const event = new AbortEvent({})
        this.event.toDestroy(event);
        if (event.detail.isValid) return;
        const parent = this.route.parent;
        DebugUtil.log(`${parent?.name} Destroyed`);
        this.origin.state.isDestroyed = true;
        this.check(source, reason);
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public check(source?: CardModel | HeroModel, reason?: Model) {
        this.origin.refer.reason = reason;
        this.origin.refer.source = source;
        DisposeModel.add(this);
    }

    protected abstract run(): void;

}