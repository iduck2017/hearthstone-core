import { DebugService, Model, StoreService, TranxService } from "set-piece";
import { CardModel } from "../card";
import { PlayerModel } from "../player";

export namespace BoardModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        cards: CardModel[];
    };
    export type Refer = {};
}

@StoreService.is('board')
export class BoardModel extends Model<
    PlayerModel,
    BoardModel.Event,
    BoardModel.State,
    BoardModel.Child,
    BoardModel.Refer
> {
    constructor(props: BoardModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            refer: { ...props.refer },
            child: { 
                cards: [],
                ...props.child 
            },
        })
    }


    @DebugService.log()
    @TranxService.use()
    add(card: CardModel) {
        this.draft.child.cards.push(card);
    }
}