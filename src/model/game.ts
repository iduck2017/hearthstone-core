import { DebugUtil, Model, StoreUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "./player";
import { RoleModel } from "./role";
import { FilterType } from "../types";

export type QueryOption = {
    side?: PlayerModel;
    isHero?: FilterType;
    isTaunt?: FilterType;
    isMinion?: FilterType;
}

export namespace GameModel {
    export type State = {
        turn: number;
    };
    export type Event = {
        onEndTurn: {};
        onStartTurn: {};
    };
    export type Child = {
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type Refer = {
        current?: PlayerModel;
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
        child: Pick<GameModel.Child, 'playerA' | 'playerB'>;
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

    public query(options: QueryOption): RoleModel[] {
        const playerA = this.child.playerA;
        const playerB = this.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const { side, isHero, isMinion } = options;
        let result: RoleModel[] = [
            ...boardA.child.cards.map(item => item.child.role),
            ...boardB.child.cards.map(item => item.child.role),
            playerA.child.hero.child.role,
            playerB.child.hero.child.role,
        ];
        result = this.pipe(isHero, result, item => Boolean(item.route.hero));
        result = this.pipe(isMinion, result, item => Boolean(item.route.card));
        result = result.filter(item => item.route.player === side);
        return result;
    }
    
    private pipe<T>(mode: FilterType | undefined, result: T[], filter: (item: T) => boolean) {
        return result.filter(item => {
            const isMatch = filter(item);
            if (mode === FilterType.INCLUDE && !isMatch) return false;
            if (mode === FilterType.EXCLUDE && isMatch) return false;
            return true;
        });
    }
    
    @DebugUtil.log()
    public nextTurn() {
        let player = this.refer.current;
        let board = player?.child.board;
        let roles = board?.child.cards.map(item => item.child.role);
        this.event.onEndTurn({});
        this.doNextTurn();
        player = this.refer.current;
        board = player?.child.board;
        roles = board?.child.cards.map(item => item.child.role);
        roles?.forEach(role => role.startTurn());
        this.event.onStartTurn({});
    }

    @TranxUtil.span()
    private doNextTurn() {
        this.draft.state.turn ++;
        this.draft.refer.current = this.refer.current?.refer.opponent ?? this.child.playerA;
    }

}