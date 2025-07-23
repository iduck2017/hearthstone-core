import { DebugUtil, Model } from "set-piece";
import { GameModel } from "./game";
import { RootModel } from "./root";
import { HandModel } from "./hand";
import { BoardModel } from "./board";
import { DeckModel } from "./deck";
import { HeroModel } from "./hero";
import { GraveyardModel } from "./graveyard";

export namespace PlayerModel {
    export type State = {};
    export type Event = {
    };
    export type Child = {
        readonly board: BoardModel;
        readonly hero: HeroModel;
        readonly hand: HandModel;
        readonly deck: DeckModel;
        readonly graveyard: GraveyardModel;
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
                deck: new DeckModel({}),
                graveyard: new GraveyardModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

    public get route(): Model['route'] & Readonly<Partial<{
        game: GameModel;
        opponent: PlayerModel;
    }>> {
        const { root, parent } = super.route;
        const game = root instanceof RootModel ? root.child.game : undefined;
        const playerA = game?.child.playerA;
        const playerB = game?.child.playerB;
        const opponent = playerA === this ? playerB : playerA;
        return {
            ...super.route,
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



