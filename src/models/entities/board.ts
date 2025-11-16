import { Model } from "set-piece";
import { GameModel, PlayerModel } from "../..";
import { MinionCardModel } from "./cards/minion";
import { CardModel } from "./cards";
import { SecretCardModel } from "../..";

export namespace BoardModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly cards: CardModel[]
        readonly secrets: SecretCardModel[]
    };
    export type R = {};
}

export class BoardModel extends Model<
    BoardModel.E,
    BoardModel.S,
    BoardModel.C,
    BoardModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
        }
    }

    public get chunk() {
        return {
            cards: this.child.cards.map(item => item.chunk),
            size: this.child.cards.length,
        }
    }

    public get refer() {
        const child = super.child;
        const refer = super.refer;
        const minions: MinionCardModel[] = child.cards
            .map(item => item instanceof MinionCardModel ? item : undefined)
            .filter(item => item !== undefined);
        return {
            ...refer,
            minions,
        }
    }

    constructor(props?: BoardModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {},
            child: { 
                cards: [],
                secrets: [],
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public add(card: SecretCardModel): void
    public add(card: MinionCardModel, position?: number): void
    public add(card: CardModel, position?: number): void {
        let cards: CardModel[] | undefined
        if (card instanceof SecretCardModel) cards = this.origin.child.secrets;
        if (card instanceof MinionCardModel) cards = this.origin.child.cards;
        if (!cards) return;
        if (position === -1) position = cards.length;
        if (position === undefined) position = cards.length;
        cards.splice(position, 0, card);
    }


    public del(card: SecretCardModel): void
    public del(card: MinionCardModel): void
    public del(card: CardModel) {
        let cards: CardModel[] | undefined
        if (card instanceof SecretCardModel) cards = this.origin.child.secrets;
        if (card instanceof MinionCardModel) cards = this.origin.child.cards;
        if (!cards) return;
        const index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
    }
}