import { DebugUtil, Model, TemplUtil } from "set-piece";
import { MinionCardModel } from "../../..";
import { GameModel } from "../../game";
import { CardModel, DeckModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../../..";

export namespace CollectionModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly cards: CardModel[]
    };
    export type R = {};
}

export class CollectionModel extends Model<
    CollectionModel.E,
    CollectionModel.S,
    CollectionModel.C,
    CollectionModel.R
> {
    public get chunk() {
        return {
            cards: this.child.cards.map(item => item.chunk),
        }
    }

    constructor(props?: CollectionModel['props']) {
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

    public apply(): DeckModel {
        const cards = this.child.cards
            .map(item => TemplUtil.copy(item))
            .filter(item => item !== undefined)
            .sort((a, b) => Math.random() - 0.5);
        return new DeckModel({
            child: { cards },
        })
    }
}
