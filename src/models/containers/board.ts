import { Loader, Model, TranxUtil } from "set-piece";
import { GameModel, PlayerModel } from "../..";
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
    export type P = {
        game: GameModel;
        player: PlayerModel;
    };
    export type R = {
        readonly order: CardModel[];
    };
}

export class BoardModel extends Model<
    BoardProps.E,
    BoardProps.S,
    BoardProps.C,
    BoardProps.R,
    BoardProps.P
> {

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
                },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        })
    }

    public add(card: CardModel, position?: number): void {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof SecretCardModel) cards = this.draft.child.secrets;
        if (card instanceof WeaponCardModel) this.draft.child.weapon = card;
        if (!cards) return
        cards.push(card);

        if (card instanceof MinionCardModel) {
            const that: MinionCardModel = card;
            const order = this.draft.refer.order;
            if (position === -1) position = order.length;
            if (position === undefined) position = order.length;
            order.splice(position, 0, that);
            return;
        }
        return;
    }


    public del(card: CardModel) {
        let cards: CardModel[] | undefined;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof SecretCardModel) cards = this.draft.child.secrets;
        if (card instanceof WeaponCardModel) this.draft.child.weapon = undefined;
        if (!cards) return false;

        // remove from cards
        let index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);

        // remove from order
        const order = this.draft.refer.order;
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);
        return card;
    }
}