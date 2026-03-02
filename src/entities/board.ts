import { asChildList, Model } from "set-piece";
import { CardModel } from "./card";
import { MinionModel } from "./minion";

export class BoardModel extends Model {
    @asChildList()
    private _cards: CardModel[];
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
    
    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
    }

    public summonMinion(minion?: MinionModel, index?: number) {
        if (!minion) return;
        if (index === undefined || index < 0 || index > this.cards.length) {
            index = this.cards.length;
        }
        console.log('Summoning minion at index', index);
        this._cards.splice(index, 0, minion);
    }
}