import { Loader, Method, Model, Props, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { BoardModel, CardModel, DeckModel, GameModel, GraveyardModel, HandModel, HeroModel, MinionCardModel, PlayerModel, RoleModel } from "../.."

export namespace RoleFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {
        minion: MinionCardModel;
        card: CardModel;
        hero: HeroModel;
        role: RoleModel;
        board: BoardModel;
        hand: HandModel;
        deck: DeckModel;
        graveyard: GraveyardModel;
    };
}

@StoreUtil.is('role-features')
export class RoleFeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
> extends FeatureModel<
    E & RoleFeatureProps.E,
    S & RoleFeatureProps.S,
    C & RoleFeatureProps.C,
    R & RoleFeatureProps.R,
    RoleFeatureProps.P
> {
    constructor(loader: Method<RoleFeatureModel['props'] & {
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
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                    minion: MinionCardModel.prototype,
                    card: CardModel.prototype,
                    hero: HeroModel.prototype,
                    role: RoleModel.prototype,
                    board: BoardModel.prototype,
                    hand: HandModel.prototype,
                    deck: DeckModel.prototype,
                    graveyard: GraveyardModel.prototype,
                }
            }
        })
    }
}