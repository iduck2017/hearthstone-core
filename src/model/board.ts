import { Model } from "set-piece";
import { MinionCardModel } from "./card/minion";

export namespace BoardModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        cards: MinionCardModel[]
    };
    export type Refer = {};
}

export class BoardModel extends Model<
    BoardModel.Event,
    BoardModel.State,
    BoardModel.Child,
    BoardModel.Refer
> {
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

    public add(card: MinionCardModel, pos: number) {
        this.draft.child.cards.splice(pos, 0, card);
    }

    public del(card: MinionCardModel) {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
        return card;
    }
}