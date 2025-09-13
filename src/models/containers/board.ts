import { Loader, Model, TranxUtil } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { MinionCardModel } from "../cards/minion";
import { CardModel } from "../cards";
import { SecretCardModel } from "../cards/secret";
import { WeaponCardModel } from "../cards/weapon";

export namespace BoardProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly minions: MinionCardModel[]
        readonly secrets: SecretCardModel[]
        weapon?: WeaponCardModel;
    };
    export type R = {
        readonly order: CardModel[];
    };
}

export class BoardModel extends Model<
    BoardProps.E,
    BoardProps.S,
    BoardProps.C,
    BoardProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    constructor(loader?: Loader<BoardModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {},
                child: { 
                    minions: [],
                    secrets: [],
                    ...props.child,
                },
                refer: { 
                    order: props.child?.minions ?? [],
                    ...props.refer
                }
            }
        })
    }

    public add(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof SecretCardModel) cards = this.draft.child.secrets;
        if (card instanceof WeaponCardModel) this.draft.child.weapon = card;
        if (cards) cards.push(card);
    }

    public sort(card: CardModel, position?: number) {
        const order = this.draft.refer.order;
        if (position === -1) position = order.length;
        if (position === undefined) position = order.length;
        order.splice(position, 0, card);
        return card;
    }

    public del(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof SecretCardModel) cards = this.draft.child.secrets;
        if (card instanceof WeaponCardModel) this.draft.child.weapon = undefined;
        if (cards) {
            const index = cards.indexOf(card);
            if (index !== -1) cards.splice(index, 1);
        } 
        const order = this.draft.refer.order;
        const index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);
        return card;
    }
}