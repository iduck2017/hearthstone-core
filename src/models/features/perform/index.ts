import { Event, Model } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { HandModel } from "../../entities/hand";
import { CardModel } from "../../entities/cards";
import { AbortEvent } from "../../../types/events/abort";
import { AppModel } from "../../app";

export namespace PerformModel {
    export type E = {
        toPlay: AbortEvent;
        onPlay: Event,
        toRun: AbortEvent;
        onRun: Event;
    }
    export type S = {
        locked: boolean;
    }
    export type C = {};
    export type R = {};
}

export abstract class PerformModel<
    E extends Partial<PerformModel.E> & Model.E = {},
    S extends Partial<PerformModel.S> & Model.S = {},
    C extends Partial<PerformModel.C> & Model.C = {},
    R extends Partial<PerformModel.R> & Model.R = {}
> extends Model<
    E & PerformModel.E, 
    S & PerformModel.S, 
    C & PerformModel.C, 
    R & PerformModel.R
> {
    public get route() {
        const result = super.route;
        const player: PlayerModel | undefined = result.items.find(item => item instanceof PlayerModel)
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel)
        return {
            ...result,  
            player,
            hand: result.items.find(item => item instanceof HandModel),
            card,
            app: result.items.find(item => item instanceof AppModel),
        }
    }

    public get status(): boolean {
        const player = this.route.player;
        if (!player) return false;
        if (!player.status) return false;
        const hand = this.route.hand;
        if (!hand) return false;
        const card = this.route.card;
        if (!card) return false;
        const cost = card.child.cost;
        if (!cost) return false;
        if (!cost.status) return false;
        return true;
    }

    public abstract play(): Promise<void>;


    public expand() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const mana = player.child.mana;
        const cost = card.child.cost;
        if (!cost) return;
        mana.consume(cost.state.current, card);
    }

    constructor(props: PerformModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                locked: false,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }
}