import { Model, Props, StoreService } from "set-piece";
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
    constructor(props: Props<
        RootModel.State,
        RootModel.Child,
        RootModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public start(props: {
        player1: PlayerModel;
        player2: PlayerModel;
    }) {
        this.draft.child.game = new GameModel({
            child: {
                player1: props.player1,
                player2: props.player2,
            },
        });
    }
}