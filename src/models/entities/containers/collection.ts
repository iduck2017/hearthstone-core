import { Model, ChunkService } from "set-piece";
import { CardModel, DeckModel } from "../../..";

export namespace CollectionModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly cards: CardModel[]
    };
    export type R = {};
}

export class CollectionModel extends Model<
    CollectionModel.E,
    CollectionModel.S,
    CollectionModel.C,
    CollectionModel.R
> {
    public get chunk() {
        return {
            cards: this.child.cards.map(item => item.chunk),
        }
    }

    constructor(props?: CollectionModel['props']) {
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

    public has(card: CardModel): boolean {
        const cards = this.origin.child.cards;
        return cards.includes(card);
    }

    public del(card: CardModel): void {
        const cards = this.origin.child.cards;
        const index = cards.indexOf(card);
        if (index === -1) return;
        cards.splice(index, 1);
    }

    public add(card: CardModel, index?: number): void {
        const cards = this.origin.child.cards;
        if (index === undefined) index = cards.length;
        if (index === -1) index = cards.length;
        cards.splice(index, 0, card);
    }

    public apply(): DeckModel {
        const cards = this.child.cards
            .map(item => ChunkService.copy(item))
            .filter(item => item !== undefined)
            .sort(Math.random);

        return new DeckModel({ child: { cards }})
    }
}
