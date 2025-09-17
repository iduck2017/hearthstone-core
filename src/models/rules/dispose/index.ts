import { DebugUtil, Event, Format, Loader, LogLevel, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, GraveyardModel, HeroModel, MinionCardModel, PlayerModel, SecretCardModel, WeaponCardModel } from '../../..'

export namespace DisposeProps {
    export type E = {
        toRun: void;
        onRun: void;
    }
    export type S = {
        isLock: boolean;
    }
    export type C = {}
    export type R = {
        detail?: Model;
        source?: CardModel | HeroModel;
    }
    export type P = {
        player: PlayerModel;
        graveyard: GraveyardModel;
        minion: MinionCardModel;
        weapon: WeaponCardModel;
        secret: SecretCardModel;
        hero: HeroModel;
    }
}

export abstract class DisposeModel extends Model<
    DisposeProps.E,
    DisposeProps.S,
    DisposeProps.C,
    DisposeProps.R,
    DisposeProps.P
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
        return this.state.isLock;
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

    constructor(loader: Loader<DisposeModel>) {
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
                    graveyard: GraveyardModel.prototype,
                    minion: MinionCardModel.prototype,
                    weapon: WeaponCardModel.prototype,
                    secret: SecretCardModel.prototype,
                    hero: HeroModel.prototype,
                },
            }
        });
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public active(isLock?: boolean, source?: CardModel | HeroModel, detail?: Model) {
        if (this.status) return;
        this.draft.refer.detail = detail;
        this.draft.refer.source = source;
        this.draft.state.isLock = isLock ?? false;
        DisposeModel.add(this);
    }

    protected abstract run(): void;

}