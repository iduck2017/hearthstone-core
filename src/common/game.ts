import { Model, StoreService } from "set-piece";
import { PlayerModel } from "./player";
import { MinionCardModel } from "./card/minion";
import { GameQuery, TargetType } from "@/types/query";
import { HeroModel } from "./hero";
import { MinionRoleModel } from "./minion";

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

    public query(target: TargetType.Minion, options: GameQuery): MinionRoleModel[];
    public query(target: TargetType, options: GameQuery): Model[] {
        if (target === TargetType.Minion) {
            let result: MinionRoleModel[] = [];
            const { playerA, playerB } = this.child;
            if (options.side !== playerA) result.push(...playerB.child.board.child.cards.map(item => item.child.role));
            if (options.side !== playerB) result.push(...playerA.child.board.child.cards.map(item => item.child.role));
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