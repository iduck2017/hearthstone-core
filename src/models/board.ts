import { Model, TranxUtil } from "set-piece";
import { GameModel, PlayerModel } from "..";
import { MinionCardModel } from "./cards/minion";
import { CardModel } from "./cards";
import { SecretCardModel } from "..";
import { WeaponCardModel } from "..";

export namespace BoardModel {
    export type E = {};
    export type S = {};
    export type C = {
        weapon?: WeaponCardModel;
        readonly minions: MinionCardModel[]
        readonly secrets: SecretCardModel[]
    };
    export type R = {
        readonly queue: CardModel[];
    };
}

export class BoardModel extends Model<
    BoardModel.E,
    BoardModel.S,
    BoardModel.C,
    BoardModel.R
> {

    constructor(props?: BoardModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {},
            child: { 
                minions: [],
                secrets: [],
                ...props.child,
            },
            refer: { 
                queue: props.child?.minions ?? [],
                ...props.refer
            },
        })
    }

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof MinionCardModel) return this.origin.child.minions;
        if (card instanceof SecretCardModel) return this.origin.child.secrets;
    }

    public add(card: CardModel, position?: number): void {
        if (card instanceof WeaponCardModel) {
            this.origin.child.weapon = card;
            return;
        }
        let cards = this.query(card);
        if (!cards) return;
        cards.push(card);

        if (card instanceof MinionCardModel) {
            const that: MinionCardModel = card;
            const queue = this.origin.refer.queue ?? [];
            if (position === -1) position = queue.length;
            if (position === undefined) position = queue.length;
            queue.splice(position, 0, that);
        }
    }


    public del(card: CardModel) {
        if (card instanceof WeaponCardModel) {
            this.origin.child.weapon = undefined;
            return;
        }
        let cards = this.query(card);
        if (!cards) return;
        let index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
        
        const queue = this.origin.refer.queue ?? [];
        index = queue.indexOf(card);
        if (index !== -1) queue.splice(index, 1);
    }
}