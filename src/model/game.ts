import { DebugUtil, Model, StoreUtil } from "set-piece";
import { PlayerModel } from "./player";
import { GameQuery, TargetType } from "../types/query";
import { RoleModel } from "./role";
import { RootModel } from "./root";

export namespace GameModel {
    export type State = {
        turn: number;
    };
    export type Event = {
        onEndTurn: void;
        onStartTurn: void;
    };
    export type Child = {
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type Refer = {
        curPlayer?: PlayerModel;
    };
}


@StoreUtil.is('game')
export class GameModel extends Model<
    GameModel.Event, 
    GameModel.State, 
    GameModel.Child,
    GameModel.Refer
> {
    constructor(props: GameModel['props'] & {
        child: GameModel.Child;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                turn: 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public query(target: TargetType.Role, options: GameQuery): RoleModel[];
    public query(target: TargetType, options: GameQuery): Model[] {
        if (target === TargetType.Role) {
            let result: RoleModel[] = [];
            const { playerA, playerB } = this.child;
            const { side, isTaunt, isHero, isRush } = options;
            const boardA = playerA.child.board;
            const boardB = playerB.child.board;
            if (!isRush && side !== playerA) result.push(playerB.child.hero.child.role);
            if (!isRush && side !== playerB) result.push(playerA.child.hero.child.role);
            if (side !== playerA) result.push(...boardB.map(item => item.child.role));
            if (side !== playerB) result.push(...boardA.map(item => item.child.role));
            if (isTaunt && result.find(item => item.state.isTaunt)) result = result.filter(item => item.state.isTaunt);
            return result;
        }
        return [];  
    }


    @DebugUtil.log()
    public nextTurn() {
        const curPlayer = this.refer.curPlayer;
        const nextPlayer = curPlayer?.route.opponent ?? this.child.playerA;
        curPlayer?.endTurn();
        this.event.onEndTurn();
        this.draft.state.turn ++;
        this.draft.refer.curPlayer = nextPlayer;
        nextPlayer.startTurn();
        this.event.onStartTurn();
    }
}