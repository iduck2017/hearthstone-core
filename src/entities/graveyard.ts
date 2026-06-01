import { Model, useChild, useMemo, useModel } from "set-piece";
import { CardModel } from "../cards";

@useModel('graveyard-model')
export class GraveyardModel extends Model {
    protected _brand: symbol = Symbol('graveyard-model');

    
    @useChild()
    private _cards: CardModel[] = [];
    @useMemo()
    public get cards() {
        return [...this._cards];
    }

    constructor(props?: { cards?: CardModel[]; }) {
        super();
        this._cards = props?.cards ?? [];
    }

    public removeCard(card?: CardModel) {
        if (!card) return;
        const index = this._cards.indexOf(card);
        if (index === -1) return;
        this._cards.splice(index, 1)
    }

    public addCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }
}