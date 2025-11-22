import { Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../entities/cards";
import { BoardModel, CollectionModel, DeckModel, GraveyardModel, HandModel, HeroModel, MinionCardModel } from "../..";

export abstract class RoleFeatureModel<
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends FeatureModel<E, S, C, R> {

    protected get isActived(): boolean {
        if (!super.isActived) return false;
        const board = this.route.board;
        if (!board) return false;
        return true;
    }

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            card,
            hero,
            minion,
            role: hero ?? minion,
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