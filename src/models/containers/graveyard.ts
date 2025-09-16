import { Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { WeaponCardModel, PlayerModel, CardModel, SpellCardModel } from "../..";

export namespace GraveyardProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[]
        weapons: WeaponCardModel[]
        spells: SpellCardModel[]
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
                    spells: [],
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
    
    public add(card: CardModel): boolean {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof WeaponCardModel) cards = this.draft.child.weapons;
        if (card instanceof SpellCardModel) cards = this.draft.child.spells;
        if (!cards) return false;
        cards.push(card);
        return true;
    }
}
