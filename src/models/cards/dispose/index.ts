import { Event, Method, Model, State, TranxUtil } from "set-piece";
import { BoardModel, CardModel, GraveyardModel, HeroModel, PlayerModel } from '../../..'

export namespace DisposeModel {
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


    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.list.find(item => item instanceof PlayerModel),
            board: result.list.find(item => item instanceof BoardModel),
            graveyard: result.list.find(item => item instanceof GraveyardModel),
        }
    }

    public get chunk(): {
        desc: string;
        state: State<S & DisposeModel.S>;
        refer: {
            reason?: [string, string];
            source?: [string, string];
        };
    } {
        const reason = this.origin.refer.reason;
        const source = this.origin.refer.source;
        return {
            desc: 'Describing the Survival Status and Cause of Death of an Entity',
            state: this.state,
            refer: {
                reason: reason ? [reason.uuid, reason.name] : undefined,
                source: source ? [source.uuid, source.name] : undefined,
            }
        }
    }
    
    public get status() {
        return Boolean(this.state.isLock);
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
                isLock: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public active(isLock?: boolean, source?: CardModel | HeroModel, reason?: Model) {
        if (this.status) return;
        this.origin.refer.reason = reason;
        this.origin.refer.source = source;
        this.origin.state.isLock = isLock ?? false;
        DisposeModel.add(this);
    }

    protected abstract run(): void;

}