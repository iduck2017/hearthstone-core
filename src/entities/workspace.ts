import { Model, useChild, useMemo, useModel } from "set-piece";
import { CardModel } from "../cards";

@useModel('workspace-model')
export class WorkspaceModel extends Model {
    protected _brand: symbol = Symbol('workspace-model');

    @useChild()
    private _cards: CardModel[] = [];
    @useMemo()
    public get cards() {
        return [...this._cards];
    }

    public removeCard(card?: CardModel) {
        if (!card) return;
        const index = this._cards.indexOf(card);
        if (index === -1) return;
        this._cards.splice(index, 1);
    }

    public addCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }
}