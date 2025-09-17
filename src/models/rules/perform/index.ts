import { Event, Loader, Method, Model, Props } from "set-piece"
import { CardModel, MinionCardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../../.."

export namespace PerformProps {
    export type E = {
        toRun: Event;
        onRun: void;
    }
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = {
        card: CardModel;
        player: PlayerModel;
    }
}

export abstract class PerformModel<
    T extends any[] = any[],
    E extends Props.E & Partial<PerformProps.E> = {},
    S extends Props.S & Partial<PerformProps.S> = {},
    C extends Props.C & Partial<PerformProps.C> = {},
    R extends Props.R & Partial<PerformProps.R> = {},
    P extends Props.P & Partial<PerformProps.P> = {}
> extends Model<
    E & PerformProps.E,
    S & PerformProps.S,
    C & PerformProps.C,
    R & PerformProps.R,
    P & PerformProps.P
> {
    constructor(loader: Method<PerformModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
        route: P;
    }, []>) {
        super(() => {
            const props = loader() ?? {}
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    card: CardModel.prototype,
                    player: PlayerModel.prototype,
                    minion: MinionCardModel.prototype,
                    weapon: WeaponCardModel.prototype,
                    spell: SpellCardModel.prototype,
                    ...props.route,
                },
            }
        })
    }

    public abstract run(from: number, ...params: T): Promise<void>;

    public abstract toRun(): Promise<T | undefined>;
}