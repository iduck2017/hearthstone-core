import { DebugUtil, Model } from "set-piece";
import { CardModel } from "../card";
import { GameModel } from "../game";
import { PlayerModel } from ".";

export namespace DeckModel {
    export type Event = {}
    export type State = {}
    export type Child = {
        cards: CardModel[]
    }
    export type Refer = {}
}

export class DeckModel extends Model<
    DeckModel.Event,
    DeckModel.State,
    DeckModel.Child,
    DeckModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: DeckModel['props']) {
        super({
            uuid: props.uuid,
            child: { 
                cards: [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer }
        })
    }

    public query(event: {}): CardModel | undefined {
        return this.child.cards[0];
    }

    public del(card: CardModel): CardModel | undefined {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        return card;
    }

}
