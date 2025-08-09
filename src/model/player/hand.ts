import { Model, TranxUtil } from "set-piece";
import { PlayerModel } from ".";
import { CardModel } from "../card";
import { GameModel } from "../game";

export namespace HandModel {
    export type Event = {}
    export type State = {}
    export type Child = {
        cards: CardModel[]
    }
    export type Refer = {}
}

export class HandModel extends Model<
    HandModel.Event,
    HandModel.State,
    HandModel.Child,
    HandModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: HandModel['props']) {
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

    @TranxUtil.span()
    public add(card: CardModel) {
        this.draft.child.cards.push(card);
        return card;
    }

    @TranxUtil.span()
    public del<T extends CardModel>(card: T): T | undefined {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        return card;
    }
}