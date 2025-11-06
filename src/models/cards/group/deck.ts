import { DebugUtil, Model } from "set-piece";
import { MinionCardModel } from "../minion";
import { GameModel } from "../../game";
import { CardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../../..";

export namespace DeckModel {
    export type E = {}
    export type S = {}
    export type C = {
        cards: CardModel[]
    }
    export type R = {}
}

export class DeckModel extends Model<
    DeckModel.E,
    DeckModel.S,
    DeckModel.C,
    DeckModel.R
> {
    public get chunk() {
        return { size: this.child.cards.length }
    }

    constructor(props?: DeckModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            child: { 
                cards: props.child?.cards ?? [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer }
        })
    }

    public draw() {
        const card = this.child.cards[0];
        if (!card) return;
        card.draw();
        return card;
    }

    public del(card: CardModel) {
        // remove from cards
        let index = this.child.cards.findIndex(item => item === card);
        if (index === -1) return;
        this.origin.child.cards.splice(index, 1);
    }
}
