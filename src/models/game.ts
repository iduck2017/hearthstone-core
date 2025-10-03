import { Method, Model, StoreUtil } from "set-piece";
import { PlayerModel } from "./player";
import { TurnModel } from "./rules/turn";

export namespace GameProps {
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
}

@StoreUtil.is('game')
export class GameModel extends Model<
    GameProps.E, 
    GameProps.S, 
    GameProps.C
> {

    constructor(loader: Method<GameModel['props'] & {
        child: Pick<GameProps.C, 'playerA' | 'playerB'>;
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    turn: 0,
                    ...props.state,
                },
                child: { 
                    turn: props.child.turn ?? new TurnModel(),
                    ...props.child
                },
                refer: { ...props.refer },
                route: {},
            }
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