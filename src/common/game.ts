import { DebugService, Model, StoreService } from "set-piece";
import { PlayerModel } from "./player";
import { GameQuery, TargetType } from "@/types/query";
import { MinionRoleModel } from "./role/minion";
import { HeroModel } from "./hero";
import { RoleModel } from "./role";

export namespace GameModel {
    export type State = {
        turn: number;
    };
    export type Event = {
        onTurnEnd: void;
        onTurnStart: void;
    };
    export type Child = {
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type Refer = {
        curPlayer?: PlayerModel;
    };
}


@StoreService.is('game')
export class GameModel extends Model<
    Model,
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

    public query(target: TargetType.MinionRole, options: GameQuery): MinionRoleModel[];
    public query(target: TargetType.Role, options: GameQuery): RoleModel[];
    public query(target: TargetType, options: GameQuery): Model[] {
        if (target === TargetType.MinionRole) {
            let result: MinionRoleModel[] = [];
            const { playerA, playerB } = this.child;
            const { side, isTaunt } = options;
            const boardA = playerA.child.board;
            const boardB = playerB.child.board;
            if (side !== playerA) result.push(...boardB.child.roles);
            if (side !== playerB) result.push(...boardA.child.roles);
            if (isTaunt) result = result.filter(item => item.state.isTaunt);
            return result;
        }
        if (target === TargetType.Role) {
            let result: RoleModel[] = [];
            const { playerA, playerB } = this.child;
            const { isHero, isRush, side, isTaunt } = options;
            if (!isHero) result.push(...this.query(TargetType.MinionRole, options));
            if (!isRush && side !== playerA) result.push(playerB.child.role);
            if (!isRush && side !== playerB) result.push(playerA.child.role);
            if (isTaunt) result = result.filter(item => item.state.isTaunt);
            return result;
        }
        return [];  
    }

    @DebugService.log()
    public nextTurn() {
        const curPlayer = this.refer.curPlayer;
        const nextPlayer = curPlayer?.route.opponent ?? this.child.playerA;
        curPlayer?.endTurn();
        this.event.onTurnEnd();
        this.draft.state.turn ++;
        this.draft.refer.curPlayer = nextPlayer;
        nextPlayer.startTurn();
        this.event.onTurnStart();
    }
}