import { Model, StoreUtil } from "set-piece";
import { PlayerModel } from "../player";
import { TurnModel } from "./turn";

export namespace GameModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly turn: TurnModel;
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type Refer = {};
}


@StoreUtil.is('game')
export class GameModel extends Model<
    GameModel.Event, 
    GameModel.State, 
    GameModel.Child,
    GameModel.Refer
> {
    constructor(props: GameModel['props'] & {
        child: Pick<GameModel.Child, 'playerA' | 'playerB'>;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                turn: 0,
                ...props.state 
            },
            child: { 
                turn: new TurnModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}