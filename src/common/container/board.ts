import { DebugService, Model, StoreService, TranxService } from "set-piece";
import { CardModel } from "../card";
import { PlayerModel } from "../player";
import { MinionCardModel } from "../card/minion";

export namespace BoardModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        cards: MinionCardModel[];
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

    public get child() {
        const child = super.child;
        return {
            ...child,
            roles: child.cards.map(item => item.child.role),
        }
    }

    @TranxService.use()
    clear() {
        this.draft.child.cards = [];
    }

    @DebugService.log()
    @TranxService.use()
    add(...cards: MinionCardModel[]) {
        this.draft.child.cards.push(...cards);
    }
}