import { asChildList, asTransaction, Model } from "set-piece";
import { CardModel } from "../cards";

export class DeckModel extends Model {
    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
    }

    @asChildList()
    private _cards: CardModel[] = [];
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

    @asTransaction()
    public removeCards(cards: CardModel[]) {
        cards.forEach(card => this.removeCard(card));
    }

    public addCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }

    @asTransaction()
    public addCards(cards: CardModel[]) {
        cards.forEach(card => this.addCard(card));
    }
}