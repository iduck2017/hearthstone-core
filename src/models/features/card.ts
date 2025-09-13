import { Loader, Method, Model, Props, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { BoardModel, CardModel, DeckModel, GameModel, GraveyardModel, HandModel, HeroModel, MinionCardModel, PlayerModel, RoleModel, SpellCardModel, WeaponCardModel } from "../.."

export namespace CardFeaturesProps {
    export type E = {};
    export type S = {};
    export type C = {
        items: FeatureModel[];
    };
}

@StoreUtil.is('features')
export class CardFeaturesModel extends Model<
    CardFeaturesProps.E,
    CardFeaturesProps.S,
    CardFeaturesProps.C
> {
    constructor(loader?: Loader<CardFeaturesModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    items: props.child?.items ?? [],
                    ...props.child
                },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    public add(feature: FeatureModel) {
        this.draft.child.items.push(feature);
        return feature;
    }
}


export namespace CardFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {
        card: CardModel;
        hero: HeroModel;
        role: RoleModel;
        board: BoardModel;
        hand: HandModel;
        deck: DeckModel;
        graveyard: GraveyardModel;

        minion: MinionCardModel;
        weapon: WeaponCardModel;
        spell: SpellCardModel;
    };
}

@StoreUtil.is('card-features')
export class CardFeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
> extends FeatureModel<
    E & CardFeatureProps.E,
    S & CardFeatureProps.S,
    C & CardFeatureProps.C,
    R & CardFeatureProps.R,
    CardFeatureProps.P
> {
    constructor(loader: Method<CardFeatureModel['props'] & {
        uuid: string | undefined,
        state: S & FeatureProps.S,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    card: CardModel.prototype,
                    hero: HeroModel.prototype,
                    role: RoleModel.prototype,
                    board: BoardModel.prototype,
                    hand: HandModel.prototype,
                    deck: DeckModel.prototype,
                    graveyard: GraveyardModel.prototype,
                    minion: MinionCardModel.prototype,
                    weapon: WeaponCardModel.prototype,
                    spell: SpellCardModel.prototype,
                },
            }
        })
    }
}