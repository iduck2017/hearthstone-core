import { Model, StoreUtil } from "set-piece";
import { PlayerModel } from "../player";
import { TurnModel } from "./turn";
import { RoleModel } from "../role";

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
    public get refer(): GameModel.Refer & {
        minions: RoleModel[];
        roles: RoleModel[];
    } {
        const refer = super.refer;
        return {
            ...refer,
            minions: [
                ...this.child.playerA.refer.minions,
                ...this.child.playerB.refer.minions,
            ],
            roles: [
                ...this.child.playerA.refer.roles,
                ...this.child.playerB.refer.roles,
            ]
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