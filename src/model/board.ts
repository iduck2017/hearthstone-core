import { Model } from "set-piece";
import { PlayerModel } from "./player";
import { CardModel } from "./card";
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
}