import { Method, Model, TemplUtil } from "set-piece";
import { PlayerModel } from "./player";
import { TurnModel } from "./rules/turn";

export namespace GameModel {
    export type S = {
        readonly debug?: {
            readonly isDrawDisabled: boolean;
        }
    };
    export type E = {};
    export type C = {
        readonly turn: TurnModel;
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type R = {};
}


@TemplUtil.is('game')
export class GameModel extends Model<
    GameModel.E, 
    GameModel.S, 
    GameModel.C,
    GameModel.R
> {
    constructor(props?: GameModel['props']) {
        props = props ?? {};
        const child = props?.child ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                playerA: child.playerA ?? new PlayerModel(),
                playerB: child.playerB ?? new PlayerModel(),
                turn: child.turn ?? new TurnModel(),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

    public query(isMinion?: boolean) {
        const playerA = this.child.playerA;
        const playerB = this.child.playerB;
        const minions = [
            ...playerA.query(isMinion),
            ...playerB.query(isMinion)
        ];
        return minions;
    }
}