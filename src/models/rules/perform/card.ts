import { Event, Model, Route } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { HandModel } from "../../entities/containers/hand";
import { CardModel } from "../../entities/cards";
import { AppModel } from "../../app";
import { GameModel } from "../../entities/game";
import { AbortEvent } from "../../../types/events/abort";

export namespace CardPerformModel {
    export type E = {
        toPlay: AbortEvent;
        onPlay: Event;
    }
    export type S = {
        isPending: boolean;
    }
    export type C = {};
    export type R = {};
    export type P = {
        player: PlayerModel | undefined;
        hand: HandModel | undefined;
        card: CardModel | undefined;
        app: AppModel | undefined;
        game: GameModel | undefined;
    }
}

export abstract class CardPerformModel<
    E extends Partial<CardPerformModel.E> & Model.E = {},
    S extends Partial<CardPerformModel.S> & Model.S = {},
    C extends Partial<CardPerformModel.C> & Model.C = {},
    R extends Partial<CardPerformModel.R> & Model.R = {}
> extends Model<
    E & CardPerformModel.E, 
    S & CardPerformModel.S, 
    C & CardPerformModel.C, 
    R & CardPerformModel.R
> {
    public get route(): Route & CardPerformModel.P {
        const result = super.route;
        const player: PlayerModel | undefined = result.items.find(item => item instanceof PlayerModel)
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel)
        return {
            ...result,  
            player,
            hand: result.items.find(item => item instanceof HandModel),
            card,
            app: result.items.find(item => item instanceof AppModel),
            game: result.items.find(item => item instanceof GameModel),
        }
    }


    public consume() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const mana = player.child.mana;
        const cost = card.child.cost;
        if (!cost) return;
        mana.consume(cost.state.current, card);
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            isReady: this.isReady,
        }
    }


    protected get isReady(): boolean {
        const player = this.route.player;
        if (!player) return false;
        if (!player.state.isCurrent) return false;

        const card = this.route.card;
        if (!card) return false;
        // cost check
        const cost = card.child.cost;
        if (!cost.state.isEnough) return false;
        return true;
    }

    constructor(props: CardPerformModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                isPending: false,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }

    public abstract run(): Promise<void>;


}