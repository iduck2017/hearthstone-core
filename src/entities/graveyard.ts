import { asChildList, asTransaction, Model } from "set-piece";
import { CardModel } from "./card";

export class GraveyardModel extends Model {
    @asChildList()
    private _cards: CardModel[] = [];
    public get cards() {
        return [...this._cards];
    }

    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
    }
    
    public disposeCard(card?: CardModel) {
        if (!card) return;
        this._cards.push(card);
    }
}