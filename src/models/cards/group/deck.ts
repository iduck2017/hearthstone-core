import { DebugUtil, Model } from "set-piece";
import { MinionCardModel } from "../minion";
import { GameModel } from "../../game";
import { CardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../../..";

export namespace DeckModel {
    export type E = {}
    export type S = {}
    export type C = {
        spells: SpellCardModel[],
        minions: MinionCardModel[],
        weapons: WeaponCardModel[]
    }
    export type R = {
        queue: CardModel[]
    }
}

export class DeckModel extends Model<
    DeckModel.E,
    DeckModel.S,
    DeckModel.C,
    DeckModel.R
> {
    public get chunk() {
        return {
            refer: {
                queue: {
                    state: { size: this.refer.queue.length ?? 0 },
                    desc: 'Unknown cards'
                }
            }
        }
    }

    constructor(props?: DeckModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            child: { 
                minions: [],
                spells: [],
                weapons: [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { 
                queue: [
                    ...props.child?.minions ?? [],
                    ...props.child?.spells ?? [],
                    ...props.child?.weapons ?? [],
                ],
                ...props.refer 
            }
        })
    }

    @DebugUtil.log()
    public draw() {
        const card = this.refer.queue[0];
        if (!card) return;
        card.draw();
        return card;
    }

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof MinionCardModel) return this.origin.child.minions;
        if (card instanceof SpellCardModel) return this.origin.child.spells;
        if (card instanceof WeaponCardModel) return this.origin.child.weapons;
    }

    public del(card: CardModel) {
        // remove from cards
        let cards = this.query(card);
        if (!cards) return;
        let index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
        
        // remove from order
        const order = this.origin.refer.queue ?? [];
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);
    }
}
