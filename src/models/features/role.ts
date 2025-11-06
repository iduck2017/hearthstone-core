import { Model } from "set-piece";
import { CardFeaturesModel } from "./group/card";
import { FeatureModel } from ".";
import { CardModel } from "../cards";
import { BoardModel, CollectionModel, DeckModel, GraveyardModel, HandModel, HeroModel, MinionCardModel, RoleModel } from "../..";

export abstract class RoleFeatureModel<
    E extends Partial<CardFeaturesModel.E> & Model.E = {},
    S extends Partial<CardFeaturesModel.S> & Model.S = {},
    C extends Partial<CardFeaturesModel.C> & Model.C = {},
    R extends Partial<CardFeaturesModel.R> & Model.R = {},
> extends FeatureModel<E, S, C, R> {

    protected get status(): boolean {
        if (!this.route.minion) return false;
        if (!this.route.board) return false;
        return true;
    }

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

            role: result.items.find(item => item instanceof RoleModel),
            hero: result.items.find(item => item instanceof HeroModel),
            minion: result.items.find(item => item instanceof MinionCardModel),
        }
    }

    constructor(props: RoleFeatureModel['props'] & {
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