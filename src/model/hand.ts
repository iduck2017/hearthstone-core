import { Model } from "set-piece";
import { PlayerModel } from "./player";
import { CardModel } from "./card";

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
}