import { asChildList, asTransaction, Model } from "set-piece";
import { CardModel } from "./card";

export class DeckModel extends Model {
    @asChildList()
    private _cards: CardModel[] = [];
    public get cards() {
        return [...this._cards];
    }

    public delCard(card?: CardModel) {
        if (!card) return;
        const index = this._cards.indexOf(card);
        if (index !== -1) {
            this._cards.splice(index, 1);
        }
    }
    @asTransaction()
    public delCards(cards: CardModel[]) {
        cards.forEach(card => this.delCard(card));
    }
    
    public addCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }
    @asTransaction()
    public addCards(cards: CardModel[]) {
        cards.forEach(card => this.addCard(card));
    }

    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
    }
}