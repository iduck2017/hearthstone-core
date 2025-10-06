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

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof MinionCardModel) return this.draft.child.minions;
        if (card instanceof SecretCardModel) return this.draft.child.secrets;
    }


    public add(card: CardModel, position?: number): void {
        if (card instanceof WeaponCardModel) {
            this.draft.child.weapon = card;
            return;
        }
        let cards = this.query(card);
        if (!cards) return;
        cards.push(card);

        if (card instanceof MinionCardModel) {
            const that: MinionCardModel = card;
            const order = this.draft.refer.order;
            if (position === -1) position = order.length;
            if (position === undefined) position = order.length;
            order.splice(position, 0, that);
        }
    }


    public del(card: CardModel) {
        if (card instanceof WeaponCardModel) {
            this.draft.child.weapon = undefined;
            return;
        }
        let cards = this.query(card);
        if (!cards) return;
        let index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
        
        const order = this.draft.refer.order;
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);
    }
}