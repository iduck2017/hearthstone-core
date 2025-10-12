import { Model } from "set-piece";
import { MinionCardModel } from "../../..";
import { GameModel } from "../../game";
import { WeaponCardModel, PlayerModel, CardModel, SpellCardModel } from "../../..";

export namespace GraveyardModel {
    export type E = {}
    export type S = {}
    export type C = {
        spells: SpellCardModel[]
        minions: MinionCardModel[]
        weapons: WeaponCardModel[]
    }
    export type P = {
        game: GameModel;
        player: PlayerModel;
    };
    export type R = {}
}

export class GraveyardModel extends Model<
    GraveyardModel.E,
    GraveyardModel.S,
    GraveyardModel.C,
    GraveyardModel.R
> {
    constructor(props?: GraveyardModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                minions: [],
                weapons: [],
                spells: [],
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof MinionCardModel) return this.origin.child.minions;
        if (card instanceof WeaponCardModel) return this.origin.child.weapons;
        if (card instanceof SpellCardModel) return this.origin.child.spells;
    }

    public add(card: CardModel): boolean {
        let cards = this.query(card);
        if (!cards) return false;
        cards.push(card);
        return true;
    }
}
