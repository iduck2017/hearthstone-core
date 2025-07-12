import { DebugUtil, Model, TranxUtil } from "set-piece";
import { GameModel } from "./game";
import { RootModel } from "./root";
import { Optional } from "set-piece";
import { CardModel } from "./card";
import { MinionCardModel } from "./card/minion";
import { HeroCardModel } from "./card/hero";
import { HandModel } from "./hand";
import { BoardModel } from "./board";

export namespace PlayerModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly board: BoardModel;
        readonly hero: HeroCardModel;
        readonly hand: HandModel;
    };
    export type Refer = {};
}

export class PlayerModel extends Model<
    PlayerModel.Event, 
    PlayerModel.State, 
    PlayerModel.Child,
    PlayerModel.Refer
> {
    constructor(props: PlayerModel['props'] & {
        child: Pick<PlayerModel.Child, 'hero'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                board: new BoardModel({}),
                hand: new HandModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

    public get route(): Readonly<Optional<{
        parent: Model;
        root: RootModel;
        game: GameModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const game = root?.child.game;
        const playerA = game?.child.playerA;
        const playerB = game?.child.playerB;
        const opponent = playerA === this ? playerB : playerA;
        return {
            ...route,
            root,
            game,
            opponent,
        }
    }

    @DebugUtil.log()
    public endTurn() {
        const board = this.child.board;
        board.child.cards.forEach(item => item.child.role.endTurn());
    }

    @DebugUtil.log()
    public startTurn() {
        const board = this.child.board;
        board.child.cards.forEach(item => item.child.role.startTurn())
    }

}



