import { Model, TypedPropertyDecorator, useChild, useMemo, useRoute, useAction, useModel } from "set-piece";
import { CardModel } from "../cards";

@useModel('deck-model')
export class DeckModel extends Model {
    protected _brand: symbol = Symbol('deck-model');
    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
        
    }

    @useChild()
    private _cards: CardModel[] = [];
    @useMemo()
    public get cards() {
        return [...this._cards];
    }

    public removeCard(card?: CardModel) {
        if (!card) return;
        const index = this._cards.indexOf(card);
        if (index !== -1) {
            this._cards.splice(index, 1);
        }
    }
    @useAction()
    public removeCards(cards: CardModel[]) {
        cards.forEach(card => this.removeCard(card));
    }
    public addCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }
    @useAction()
    public addCards(cards: CardModel[]) {
        cards.forEach(card => this.addCard(card));
    }
}