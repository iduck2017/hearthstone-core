import { DebugUtil, Event, Model } from "set-piece";
import { AbortEvent, CardModel } from "../../..";

export namespace DeckModel {
    export type E = {}
    export type S = {}
    export type C = {
        readonly cards: CardModel[]
    }
    export type R = {}
}

export class DeckModel extends Model<
    DeckModel.E,
    DeckModel.S,
    DeckModel.C,
    DeckModel.R
> {
    public get chunk() {
        return { size: this.child.cards.length }
    }


    constructor(props?: DeckModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            child: { 
                cards: props.child?.cards ?? [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer }
        })
    }


    public add(item: CardModel, index?: number): void {
        const items = this.origin.child.cards;
        if (index === undefined) index = items.length;
        if (index === -1) index = items.length;
        items.splice(index, 0, item);
    }

    public del(card: CardModel) {
        const cards = this.origin.child.cards;
        let index = cards.findIndex(item => item === card);
        if (index === -1) return;
        cards.splice(index, 1);
    }

    public has(card: CardModel): boolean {
        const cards = this.origin.child.cards;
        return cards.includes(card);
    }
}
