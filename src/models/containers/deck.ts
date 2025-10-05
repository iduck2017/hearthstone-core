import { DebugUtil, Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { CardModel, PlayerModel } from "../..";

export namespace DeckProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[]
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
                    ...props.child,
                },
                state: { ...props.state },
                refer: { 
                    order: props.child?.minions ?? [],
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
        const card = this.child.minions[0];
        if (!card) return;
        card.draw();
        return card;
    }

    public del(card: CardModel): boolean {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (!cards) return false;

        // remove from cards
        let index = cards.indexOf(card);
        if (index === -1) return false;
        cards.splice(index, 1);

        // remove from order
        const order = this.draft.refer.order;
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);

        return true;
    }
}
