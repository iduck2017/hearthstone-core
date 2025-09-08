import { Loader, Model } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { CardModel } from "../cards";
import { WeaponModel } from "../..";

export namespace GraveyardProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[]
        weapons: WeaponModel[]
    }
    export type R = {}
}

export class GraveyardModel extends Model<
    GraveyardProps.E,
    GraveyardProps.S,
    GraveyardProps.C,
    GraveyardProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

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
            }
        });
    }
    
    public add(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof WeaponModel) cards = this.draft.child.weapons;
        if (!cards) return;
        cards.push(card);
        return card;
    }
}
