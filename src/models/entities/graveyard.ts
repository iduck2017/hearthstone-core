import { Model } from "set-piece";
import { MinionCardModel } from "../..";
import { GameModel } from "./game";
import { WeaponCardModel, PlayerModel, CardModel, SpellCardModel } from "../..";

export namespace GraveyardModel {
    export type E = {}
    export type S = {}
    export type C = {
        cards: CardModel[]
    }
    export type R = {}
}

export class GraveyardModel extends Model<
    GraveyardModel.E,
    GraveyardModel.S,
    GraveyardModel.C,
    GraveyardModel.R
> {
    constructor(props?: GraveyardModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                cards: props.child?.cards ?? [],
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }

    public add(card: CardModel): boolean {
        this.origin.child.cards.push(card);
        return true;
    }
}
