import { Model } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../players";
import { CardModel } from "../card";

export namespace BoardModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        cards: CardModel[]
    };
    export type Refer = {};
}

export class BoardModel extends Model<
    BoardModel.Event,
    BoardModel.State,
    BoardModel.Child,
    BoardModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: BoardModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                cards: [],
                ...props.child 
            },
            refer: { ...props.refer }
        })  
    }

    public add(card: CardModel, pos: number) {
        if (!card.child.minion) return;
        this.draft.child.cards.splice(pos, 0, card);
    }

    public del(card: CardModel) {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        return card;
    }
}