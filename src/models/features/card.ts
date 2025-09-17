import { Loader, Method, Model, Props, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { BoardModel, CardModel, DeckModel, GraveyardModel, HandModel, HeroModel, MinionCardModel, RoleModel, SecretCardModel, SpellCardModel, WeaponCardModel } from "../.."

export namespace CardFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {
        card: CardModel;
        hero: HeroModel;
        role: RoleModel;

        minion: MinionCardModel;
        weapon: WeaponCardModel;
        spell: SpellCardModel;
        secret: SecretCardModel;
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
                    minion: MinionCardModel.prototype,
                    weapon: WeaponCardModel.prototype,
                    spell: SpellCardModel.prototype,
                    secret: SecretCardModel.prototype,
                },
            }
        })
    }
}