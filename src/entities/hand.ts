import { asChildList, asRoute, asTransaction, Model } from "set-piece";
import { CardModel } from "./card";
import { PlayerModel } from "./player";

export class HandModel extends Model {
    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;

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

    public drawCard() {
        const deck = this._player?.deck;
        const card = deck?.cards[0];
        if (!card) return;

        deck.delCard(card);
        this.addCard(card);
    }
}