import { Model, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { MinionModel } from "../cards/minion";
import { GameModel } from "../game";
import { CardModel } from "../cards";

export namespace HandProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionModel[]
    }
    export type R = {}
}

export class HandModel extends Model<
    HandProps.E,
    HandProps.S,
    HandProps.C,
    HandProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: HandModel['props']) {
        super({
            uuid: props.uuid,
            child: { 
                minions: [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer }
        })
    }
   
    public add(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionModel) cards = this.draft.child.minions;
        if (!cards) return;
        cards.push(card);
        return card;
    }

    public del(card: CardModel): CardModel | undefined {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionModel) cards = this.draft.child.minions;
        if (!cards) return;
        const index = cards.indexOf(card);
        if (index === -1) return;
        cards.splice(index, 1);
        return card;
    }
}