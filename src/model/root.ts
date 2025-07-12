import { DebugUtil, Model, StoreUtil } from "set-piece";
import { GameModel } from "./game";

export namespace RootModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        game?: GameModel
    };
    export type Refer = {};
}

@StoreUtil.is('root')
export class RootModel extends Model<
    RootModel.Event, 
    RootModel.State, 
    RootModel.Child,
    RootModel.Refer
> {
    constructor(props: RootModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    @DebugUtil.log()
    public startGame(game: GameModel) {
        this.draft.child.game = game;
        game.nextTurn();
    }

    @DebugUtil.log()
    public endGame() {
        delete this.draft.child.game;
    }
}