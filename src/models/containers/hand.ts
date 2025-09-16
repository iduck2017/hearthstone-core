import { Loader, Model, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CardModel } from "../cards";
import { WeaponCardModel, MinionCardModel, SpellCardModel } from "../..";

export namespace HandProps {
    export type E = {}
    export type S = {}
    export type C = {
        minions: MinionCardModel[],
        weapons: WeaponCardModel[],
        spells: SpellCardModel[],
        cache: CardModel[],
    }
    export type P = {
        game: GameModel;
        player: PlayerModel;
    };
    export type R = {
        order: CardModel[]
    }
}

export class HandModel extends Model<
    HandProps.E,
    HandProps.S,
    HandProps.C,
    HandProps.R,
    HandProps.P
> {
    constructor(loader?: Loader<HandModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                child: { 
                    spells: [],
                    minions: [],
                    weapons: [],
                    cache: [],
                    ...props.child,
                },
                state: { ...props.state },
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
   
    public add(card: CardModel, position?: number): boolean {
        const order = this.draft.refer.order;
        if (position === -1) position = order.length;
        if (!position) position = order.length;

        let cards: CardModel[] | undefined;
        if (card instanceof SpellCardModel) cards = this.draft.child.spells;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof WeaponCardModel) cards = this.draft.child.weapons;
        if (!cards) return false;
        
        cards.push(card);
        order.splice(position, 0, card);
        return true;
    }

    @TranxUtil.span()
    public use(card: CardModel) {
        const order = this.draft.refer.order;

        let cards: CardModel[] | undefined;
        if (card instanceof SpellCardModel) cards = this.draft.child.spells;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof WeaponCardModel) cards = this.draft.child.weapons;
        if (!cards) return;
        
        let index = cards.indexOf(card);
        if (index === -1) return;
        if (index !== -1) cards.splice(index, 1);
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);

        this.draft.child.cache.push(card);
    }

    public del(card: CardModel): boolean {
        const cache = this.draft.child.cache;
        const index = cache.indexOf(card);
        if (index === -1) return false;
        cache.splice(index, 1);
        return true;
    }
}