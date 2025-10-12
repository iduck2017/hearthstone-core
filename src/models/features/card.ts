import { Model } from "set-piece";
import { CardFeatsModel } from "./group/card";
import { FeatureModel } from ".";
import { CardModel } from "../cards";
import { BoardModel, CollectionModel, DeckModel, GraveyardModel, HandModel } from "../..";

export abstract class CardFeatureModel<
    E extends Partial<CardFeatsModel.E> & Model.E = {},
    S extends Partial<CardFeatsModel.S> & Model.S = {},
    C extends Partial<CardFeatsModel.C> & Model.C = {},
    R extends Partial<CardFeatsModel.R> & Model.R = {},
> extends FeatureModel<E, S, C, R> {

    protected get status(): boolean {
        if (!this.route.board) return false;
        return true;
    }

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.list.find(item => item instanceof CardModel);
        return {
            ...result,
            card,
            board: result.list.find(item => item instanceof BoardModel),
            hand: result.list.find(item => item instanceof HandModel),
            deck: result.list.find(item => item instanceof DeckModel),
            graveyard: result.list.find(item => item instanceof GraveyardModel),
            collection: result.list.find(item => item instanceof CollectionModel),
        }
    }

    constructor(props: CardFeatureModel['props'] & {
        uuid: string | undefined;
        state: S & FeatureModel.S;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}