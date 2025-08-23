import { Model } from "set-piece";
import { MinionModel } from "../card/minion";
import { GameModel } from "../game";
import { PlayerModel } from ".";

export namespace BoardModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        cards: MinionModel[]
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

    public add(card: MinionModel, pos: number) {
        this.draft.child.cards.splice(pos, 0, card);
    }

    public del(card: MinionModel) {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        return card;
    }
}