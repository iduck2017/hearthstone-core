import { Event, Loader, Method, Model, Props } from "set-piece"
import { CardModel, MinionCardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../../.."

export namespace PerformProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    }
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = {
        card: CardModel;
        player: PlayerModel;
        minion: MinionCardModel;
        weapon: WeaponCardModel;
        spell: SpellCardModel
    }
}

export abstract class PerformModel<T extends any[] = any[]> extends Model<
    PerformProps.E,
    PerformProps.S,
    PerformProps.C,
    PerformProps.R,
    PerformProps.P
> {
    constructor(loader?: Loader<PerformModel>) {
        super(() => {
            const props = loader?.() ?? {}
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
                },
            }
        })
    }

    public abstract run(from: number, ...params: T): Promise<void>;

    public abstract toRun(): Promise<T | undefined>;
}