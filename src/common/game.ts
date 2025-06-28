import { Model, StoreService } from "set-piece";
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
    public query(target: TargetType.HeroRole, options: GameQuery): RoleModel[];
    public query(target: TargetType, options: GameQuery): Model[] {
        if (target === TargetType.MinionRole) {
            let result: MinionRoleModel[] = [];
            const { playerA, playerB } = this.child;
            const boardA = playerA.child.board;
            const boardB = playerB.child.board;
            if (options.side !== playerA) result.push(...boardB.child.cards.map(item => item.child.role));
            if (options.side !== playerB) result.push(...boardA.child.cards.map(item => item.child.role));
            return result;
        }
        if (target === TargetType.HeroRole) {
            let result: RoleModel[] = [];
            const { playerA, playerB } = this.child;
            if (options.side !== playerA) result.push(playerB.child.hero.child.role);
            if (options.side !== playerB) result.push(playerA.child.hero.child.role);
            return result;
        }
        return [];  
    }

    public nextTurn() {
        this.event.onTurnEnd();
        this.draft.state.turn ++;
        this.event.onTurnStart();
    }
}