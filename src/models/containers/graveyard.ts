import { Model } from "set-piece";
import { MinionModel } from "../cards/minion";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { CardModel } from "../cards";

export namespace GraveyardProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionModel[]
    }
    export type R = {}
}

export class GraveyardModel extends Model<
    GraveyardProps.E,
    GraveyardProps.S,
    GraveyardProps.C,
    GraveyardProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: GraveyardModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                minions: [],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
    
    public add(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionModel) cards = this.draft.child.minions;
        if (!cards) return;
        cards.push(card);
        return card;
    }
}
