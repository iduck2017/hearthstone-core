import { DebugUtil, Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { CardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../..";

export namespace DeckProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[],
        spells: SpellCardModel[],
        weapons: WeaponCardModel[]
    }
    export type P = {
        game: GameModel;
        player: PlayerModel;
    }
    export type R = {
        order: CardModel[]
    }
}

export class DeckModel extends Model<
    DeckProps.E,
    DeckProps.S,
    DeckProps.C,
    DeckProps.R,
    DeckProps.P
> {

    constructor(loader?: Loader<DeckModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                child: { 
                    minions: [],
                    spells: [],
                    weapons: [],
                    ...props.child,
                },
                state: { ...props.state },
                refer: { 
                    order: [
                        ...props.child?.minions ?? [],
                        ...props.child?.spells ?? [],
                        ...props.child?.weapons ?? [],
                    ],
                    ...props.refer 
                },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        })
    }

    @DebugUtil.log()
    public draw() {
        const card = this.refer.order[0];
        if (!card) return;
        card.draw();
        return card;
    }

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof MinionCardModel) return this.draft.child.minions;
        if (card instanceof SpellCardModel) return this.draft.child.spells;
        if (card instanceof WeaponCardModel) return this.draft.child.weapons;
    }

    public del(card: CardModel) {
        // remove from cards
        let cards = this.query(card);
        if (!cards) return;
        let index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
        
        // remove from order
        const order = this.draft.refer.order;
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);
    }
}
