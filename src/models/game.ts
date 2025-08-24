import { Model, StoreUtil } from "set-piece";
import { PlayerModel } from "./players";
import { TurnModel } from "./rules/turn";

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
    public get refer() {
        const refer = super.refer;
        const playerA = this.child.playerA;
        const playerB = this.child.playerB;
        return {
            ...refer,
            roles: [ ...playerA.refer.roles, ...playerB.refer.roles ],
            minions: [...playerA.refer.minions, ...playerB.refer.minions ],
        }
    }
    
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