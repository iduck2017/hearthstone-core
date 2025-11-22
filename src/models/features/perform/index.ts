import { Event, Model, Route } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { HandModel } from "../../entities/containers/hand";
import { CardModel } from "../../entities/cards";
import { AppModel } from "../../app";
import { GameModel } from "../../entities/game";
import { AbortEvent } from "../../../types/events/abort";

export namespace PerformModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event
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
    public get route(): Route & PerformModel.P {
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

    protected get isValid(): boolean {
        // turn check
        const game = this.route.game;
        if (!game) return false;
        const player = this.route.player;
        if (!player) return false;
        const turn = game.child.turn;
        const current = turn.refer.current;
        if (current !== player) return false;
        // hand check
        const hand = this.route.hand;
        if (!hand) return false;
        const card = this.route.card;
        if (!card) return false;
        // cost check
        const cost = card.child.cost;
        if (!cost.isValid) return false;
        return true;
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
                isPending: false,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }

    public abstract run(): Promise<void>;


}