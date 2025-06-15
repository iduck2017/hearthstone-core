import { Model, Props, TranxService } from "set-piece";
import { CardModel } from "./card";
import { WispCardModel } from "@/extension/classic/card/wisp/card";
import { PlayerModel } from "./player";

export namespace HandModel {
    export type Event = {};
    export type State = {
    };
    export type Child = {
        cards: CardModel[];
    };
    export type Refer = {};
}

export class HandModel extends Model<
    PlayerModel,
    HandModel.Event,
    HandModel.State,
    HandModel.Child,
    HandModel.Refer
> {
    constructor(props: Props<
        HandModel.State,
        HandModel.Child,
        HandModel.Refer
    >) {
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

    public get() {
        this.draft.child.cards.push(
            new WispCardModel({})
        )
    }

    @TranxService.use()
    public del(card: CardModel) {
        const index = this.draft.child.cards.indexOf(card);
        if (index === -1) return;
        this.draft.child.cards.splice(index, 1);
    }
}