import { Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { WeaponCardModel, PlayerModel, CardModel } from "../..";

export namespace GraveyardProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[]
        weapons: WeaponCardModel[]
    }
    export type P = {
        game: GameModel;
        player: PlayerModel;
    };
    export type R = {}
}

export class GraveyardModel extends Model<
    GraveyardProps.E,
    GraveyardProps.S,
    GraveyardProps.C,
    GraveyardProps.R,
    GraveyardProps.P
> {
    constructor(loader?: Loader<GraveyardModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    minions: [],
                    weapons: [],
                    ...props.child,
                },
                refer: { ...props.refer },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        });
    }
    
    public add(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof WeaponCardModel) cards = this.draft.child.weapons;
        if (!cards) return;
        cards.push(card);
        return card;
    }
}
