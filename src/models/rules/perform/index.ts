import { Event, Method, Model, Route } from "set-piece"
import { CardModel, MinionCardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../../.."
import { AbortEvent } from "../../../types/abort-event";

export namespace PerformModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

export abstract class PerformModel<
    T extends any[] = any[],
    E extends Partial<PerformModel.E> & Model.E = {},
    S extends Partial<PerformModel.S> & Model.S = {},
    C extends Partial<PerformModel.C> & Model.C = {},
    R extends Partial<PerformModel.R> & Model.R = {},
> extends Model<
    E & PerformModel.E,
    S & PerformModel.S,
    C & PerformModel.C,
    R & PerformModel.R
> {
    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.list.find(item => item instanceof CardModel);
        const player: PlayerModel | undefined = result.list.find(item => item instanceof PlayerModel);
        return {
            ...result,
            card,
            player,
        }
    }

    constructor(props: PerformModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public abstract run(from: number, ...params: T): Promise<void>;

    public abstract toRun(): Promise<T | undefined>;
}