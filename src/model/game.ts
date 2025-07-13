import { DebugUtil, Model, StoreUtil } from "set-piece";
import { PlayerModel } from "./player";
import { CardQuery, RoleQuery } from "../types/query";
import { RoleModel } from "./role";
import { RootModel } from "./root";
import { CardModel } from "./card";
import { QueryMode } from "../types/enums";
import { HeroCardModel } from "./card/hero";
import { MinionCardModel } from "./card/minion";

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


    private pipe<T>(mode: QueryMode | undefined, result: T[], filter: (item: T) => boolean) {
        return result.filter(item => {
            const isMatch = filter(item);
            if (mode === QueryMode.REQUIRED && !isMatch) return false;
            if (mode === QueryMode.EXCLUDE && isMatch) return false;
            return true;
        });
    }

    public query(options: RoleQuery) {
        const playerA = this.child.playerA;
        const playerB = this.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const { side, isHero, isMinion } = options;
        let result = [
            ...boardA.child.cards,
            ...boardB.child.cards,
            playerA.child.hero,
            playerB.child.hero,
        ];
        result = this.pipe(isHero, result, item => item instanceof HeroCardModel);
        result = this.pipe(isMinion, result, item => item instanceof MinionCardModel);
        result = result.filter(item => item.route.owner === side);
        return result;
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