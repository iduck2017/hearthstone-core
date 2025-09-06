import { Method, Model, StoreUtil } from "set-piece";
import { PlayerModel } from "./player";
import { TurnModel } from "./rules/turn";
import { RoleModel } from "./role";

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
    public get refer() {
        return {
            ...super.refer,
            roles: [
                ...this.child.playerA.refer.roles,
                ...this.child.playerB.refer.roles
            ],
            minions: [
                ...this.child.playerA.refer.minions,
                ...this.child.playerB.refer.minions
            ]
        }
    }

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
            }
        });
    }


}