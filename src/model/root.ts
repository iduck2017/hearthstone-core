import { DebugService, Model, StoreService } from "set-piece";
import { GameModel } from "./game";

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
    public start(game: GameModel) {
        this.draft.child.game = game;
        console.log(this.status, this.child.game?.status)
    }

    @DebugService.log()
    public end() {
        delete this.draft.child.game;
    }
}