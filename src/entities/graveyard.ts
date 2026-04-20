import { Model, useChild, useMemo } from "set-piece";
import { CardModel } from "../cards";

export class GraveyardModel extends Model {
    @useChild()
    private _cards: CardModel[] = [];
    @useMemo()
    public get cards() {
        return [...this._cards];
    }

    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
        this.init();
    }

    public removeCard(card?: CardModel) {
        if (!card) return;
        const index = this._cards.indexOf(card);
        if (index !== -1) {
            this._cards.splice(index, 1);
        }
    }

    public disposeCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }
}