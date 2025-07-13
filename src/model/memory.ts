import { Model } from "set-piece";
import { CardModel } from "./card";

export namespace MemoryModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        cards: CardModel[];
    };
    export type Refer = {};
}

export class MemoryModel extends Model<
    MemoryModel.State,
    MemoryModel.Event,
    MemoryModel.Child,
    MemoryModel.Refer
> {
    constructor(props: MemoryModel['props']) {
        super({
            uuid: props.uuid,
            state: {},
            child: {
                cards: [],
            },
            refer: {},
        });
    }
}