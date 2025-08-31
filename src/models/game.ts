import { Model, StoreUtil } from "set-piece";
import { PlayerModel } from "./player";
import { TurnModel } from "./rules/turn";

export namespace GameProps {
    export type S = {};
    export type E = {};
    export type C = {
        readonly turn: TurnModel;
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type R = {};
}


@StoreUtil.is('game')
export class GameModel extends Model<
    GameProps.E, 
    GameProps.S, 
    GameProps.C, 
    GameProps.R
> {
    constructor(props: GameModel['props'] & {
        child: Pick<GameProps.C, 'playerA' | 'playerB'>;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                turn: 0,
                ...props.state 
            },
            child: { 
                turn: props.child.turn ?? new TurnModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}