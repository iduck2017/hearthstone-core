import { Model, StoreUtil } from "set-piece";
import { PlayerModel } from "../player";
import { RoleModel } from "../role";
import { FilterType } from "../../types";
import { TurnModel } from "./turn";

export type QueryOption = {
    side?: PlayerModel;
    isHero?: FilterType;
    isMinion?: FilterType;
    isTaunt?: FilterType;
}

export namespace GameModel {
    export type State = {};
    export type Event = {
        onEndTurn: void;
        onStartTurn: void;
    };
    export type Child = {
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
        readonly turn: TurnModel;
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
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    private _query<T>(mode: FilterType | undefined, result: T[], filter: (item: T) => boolean) {
        return result.filter(item => {
            const isMatch = filter(item);
            if (mode === FilterType.INCLUDE && !isMatch) return false;
            if (mode === FilterType.EXCLUDE && isMatch) return false;
            return true;
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
        result = this._query(isHero, result, item => Boolean(item.route.hero));
        result = this._query(isMinion, result, item => Boolean(item.route.card));
        result = result.filter(item => item.route.owner === side);
        return result;
    }
}