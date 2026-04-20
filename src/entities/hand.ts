import { Model, TypedPropertyDecorator, useChild, useMemo, useRoute, useAction } from "set-piece";
import { PlayerModel } from "./player";
import { CardModel } from "../cards";

export class HandModel extends Model {
    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

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

    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
        this.init();
    }
}