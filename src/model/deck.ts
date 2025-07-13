import { Model } from "set-piece";
import { CardModel } from "./card";

export namespace DeckModel {
    export type Event = {}
    export type State = {}
    export type Child = {
        cards: CardModel[]
    }
    export type Refer = {}
}

export class DeckModel extends Model<
    DeckModel.Event,
    DeckModel.State,
    DeckModel.Child,
    DeckModel.Refer
> {
    constructor(props: DeckModel['props']) {
        super({
            uuid: props.uuid,
            child: { 
                cards: [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer }
        })
    }

    public get(options: {}): CardModel | undefined {
        return this.child.cards[0];
    }

    public del(card: CardModel): CardModel | undefined {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        return card;
    }
}
