import { Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { WeaponCardModel, PlayerModel, CardModel, SpellCardModel } from "../..";

export namespace GraveyardProps {
    export type E = {}
    export type S = {}
    export type C = {
        spells: SpellCardModel[]
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

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof MinionCardModel) return this.draft.child.minions;
        if (card instanceof WeaponCardModel) return this.draft.child.weapons;
        if (card instanceof SpellCardModel) return this.draft.child.spells;
    }

    public add(card: CardModel): boolean {
        let cards = this.query(card);
        if (!cards) return false;
        cards.push(card);
        return true;
    }
}
