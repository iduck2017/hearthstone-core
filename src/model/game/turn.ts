import { DebugUtil, Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from ".";

export namespace TurnModel {
    export type State = {
        count: number;
    };
    export type Event = {
        onEnd: {};
        onStart: {};
    };
    export type Child = {};
    export type Refer = {
        player?: PlayerModel;
    };
}

export class TurnModel extends Model<
    TurnModel.Event, 
    TurnModel.State, 
    TurnModel.Child,
    TurnModel.Refer
> {
    constructor(props: TurnModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                count: 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get route(): Model['route'] & { game?: GameModel } {
        return {
            ...super.route,
            game: this.assert(1, GameModel),
        }
    }
    
    @DebugUtil.log()
    public next() {
        const player = this.refer.player;
        const nextPlayer = player?.route.opponent ?? this.route.game?.child.playerA;
        player?.endTurn();
        this.event.onEnd({});
        this.draft.state.count ++;
        this.draft.refer.player = nextPlayer;
        nextPlayer?.startTurn();
        this.event.onStart({});
    }
}