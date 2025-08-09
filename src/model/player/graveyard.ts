import { Model } from "set-piece";
import { CardModel } from "../card";
import { AppModel } from "..";
import { GameModel } from "../game";
import { PlayerModel } from ".";

export namespace GraveyardModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly cards: CardModel[];
    };
    export type Refer = {};
}

export class GraveyardModel extends Model<
    GraveyardModel.Event,
    GraveyardModel.State,
    GraveyardModel.Child,
    GraveyardModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: GraveyardModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                cards: [],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
    
    public add(card: CardModel) {
        this.draft.child.cards.push(card);
        return card;
    }
}
