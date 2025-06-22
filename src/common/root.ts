import { DebugService, Model, StoreService } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./player";

export namespace RootModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        game?: GameModel
    };
    export type Refer = {};
}


@StoreService.is('root')
export class RootModel extends Model<
    never,
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

    @DebugService.log()
    public start(props: Pick<GameModel.Child, 'playerA' | 'playerB'>) {
        this.draft.child.game = new GameModel({
            child: {
                playerA: props.playerA,
                playerB: props.playerB,
            },
        });
    }

    @DebugService.log()
    public end() {
        delete this.draft.child.game;
    }
}