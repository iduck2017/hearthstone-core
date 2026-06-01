import { Model, TypedPropertyDecorator, useChild, useMemo, useRoute, useModel } from "set-piece";
import { CardModel } from "../cards";
import { MinionModel } from "../cards/minion";
import { GameModel } from "./game";

@useModel('board-model')
export class BoardModel extends Model {
    protected _brand: symbol = Symbol('board-model');
    constructor(props?: {
        cards?: CardModel[];
    }) {
        super();
        this._cards = props?.cards ?? [];
    }

    @useRoute(() => GameModel)
    private game?: GameModel;

    @useChild()
    private _cards: CardModel[];
    @useMemo()
    public get cards() {
        return [...this._cards];
    }

    @useMemo()
    public get minions(): MinionModel[] {
        return this._cards.filter((card) => card instanceof MinionModel)
    }
    public summonMinion(minion?: MinionModel, index?: number) {
        if (!minion) return;
        if (index === undefined || index < 0 || index > this.cards.length) {
            index = this.cards.length;
        }
        console.log('Summoning minion at index', index);
        this._cards.splice(index, 0, minion);
    }
    public removeCard(card?: CardModel) {
        if (!card) return;
        const index = this._cards.indexOf(card);
        if (index !== -1) {
            this._cards.splice(index, 1);
        }
    }
}
