import { Model } from "set-piece";
import { CardModel } from "./card";

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
