import { Model } from "set-piece";
import { GameModel, PlayerModel } from "../../..";
import { MinionCardModel } from "../minion";
import { CardModel } from "..";
import { SecretCardModel } from "../../..";
import { WeaponCardModel } from "../../..";

export namespace BoardModel {
    export type E = {};
    export type S = {};
    export type C = {
        weapon?: WeaponCardModel;
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
            weapon: this.child.weapon?.chunk,
            cards: this.child.cards.map(item => item.chunk),
            size: this.child.cards.length,
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

    public add(card: CardModel, position?: number): void {
        if (card instanceof WeaponCardModel) {
            this.origin.child.weapon = card;
        }
        else if (card instanceof SecretCardModel) {
            const that: SecretCardModel = card;
            const secrets = this.origin.child.secrets ?? [];
            if (position === -1) position = secrets.length;
            if (position === undefined) position = secrets.length;
            secrets.splice(position, 0, that);
        }
        else if (card instanceof MinionCardModel) {
            const that: MinionCardModel = card;
            const cards = this.origin.child.cards ?? [];
            if (position === -1) position = cards.length;
            if (position === undefined) position = cards.length;
            cards.splice(position, 0, that);
        }
    }


    public del(card: CardModel) {
        if (card instanceof WeaponCardModel) {
            this.origin.child.weapon = undefined;
        }
        else if (card instanceof SecretCardModel) {
            const that: SecretCardModel = card;
            const secrets = this.origin.child.secrets ?? [];
            const index = secrets.indexOf(that);
            if (index !== -1) secrets.splice(index, 1);
        }
        else if (card instanceof MinionCardModel) {
            const that: MinionCardModel = card;
            const cards = this.origin.child.cards ?? [];
            const index = cards.indexOf(that);
            if (index !== -1) cards.splice(index, 1);
        }
    }
}