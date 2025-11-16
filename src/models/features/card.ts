import { Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../entities/cards";
import { BoardModel, CollectionModel, DeckModel, GraveyardModel, HandModel } from "../..";

export abstract class CardFeatureModel<
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends FeatureModel<E, S, C, R> {

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        return {
            ...result,
            card,
            board: result.items.find(item => item instanceof BoardModel),
            hand: result.items.find(item => item instanceof HandModel),
            deck: result.items.find(item => item instanceof DeckModel),
            graveyard: result.items.find(item => item instanceof GraveyardModel),
            collection: result.items.find(item => item instanceof CollectionModel),
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