import { DebugService, Model, StoreService, TranxService } from "set-piece";
import { CardModel } from "../card";
import { PlayerModel } from "../player";
import { MinionCardModel } from "../card/minion";

export namespace BoardModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly cards: MinionCardModel[];
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

    @TranxService.use()
    reset() {
        while (this.draft.child.cards.length) this.draft.child.cards.pop();
    }

    @DebugService.log()
    @TranxService.use()
    add(...cards: MinionCardModel[]) {
        this.draft.child.cards.push(...cards);
    }
}