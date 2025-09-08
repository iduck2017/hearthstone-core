import { DebugUtil, Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { CardModel } from "../cards";

export namespace DeckProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[]
    }
    export type R = {}
}

export class DeckModel extends Model<
    DeckProps.E,
    DeckProps.S,
    DeckProps.C,
    DeckProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

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

    public del(card: CardModel): CardModel | undefined {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (!cards) return;
        const index = cards.indexOf(card);
        if (index === -1) return;
        cards.splice(index, 1);
        return card;
    }
}
