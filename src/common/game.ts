import { Model, Props, StoreService } from "set-piece";
import { PlayerModel } from "./player";

export namespace GameModel {
    export type State = {
        round: number;
    };
    export type Event = {};
    export type Child = {
        readonly player1: PlayerModel;
        readonly player2: PlayerModel;
    };
    export type Refer = {};
}


@StoreService.is('game')
export class GameModel extends Model<
    Model,
    GameModel.Event, 
    GameModel.State, 
    GameModel.Child,
    GameModel.Refer
> {
    constructor(props: Props<
        GameModel.State,
        GameModel.Child,
        GameModel.Refer
    > & {
        child: {
            readonly player1: PlayerModel;
            readonly player2: PlayerModel;
        };
    }) {
        super({
            uuid: props.uuid,
            state: { 
                round: 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    public query(options: {
        
    }) {

    }
}