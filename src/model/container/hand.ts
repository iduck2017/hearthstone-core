import { Model, TranxService } from "set-piece";
import { CardModel } from "../card";
import { PlayerModel } from "../player";

export namespace HandModel {
    export type Event = {};
    export type State = {
    };
    export type Child = {
        cards: CardModel[];
        cache: CardModel[];
    };
    export type Refer = {};
}

export class HandModel extends Model<
    PlayerModel,
    HandModel.Event,
    HandModel.State,
    HandModel.Child,
    HandModel.Refer
> {
    constructor(props: HandModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                cards: [],
                cache: [],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public clear() {
        this.draft.child.cards = [];
    }

    public add(card?: CardModel) {
        if (!card) return;
        this.draft.child.cards.push(card);
        return card;
    }

    public del(card: CardModel) {
        const index = this.draft.child.cache.indexOf(card);
        if (index === -1) return;
        this.draft.child.cache.splice(index, 1);
    }
    
    @TranxService.use()
    public use(card: CardModel) {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        this.draft.child.cache.push(card);
    }
}