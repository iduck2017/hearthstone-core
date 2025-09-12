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
    export type R = {
        order: CardModel[]
    }
}

export class HandModel extends Model<
    HandProps.E,
    HandProps.S,
    HandProps.C,
    HandProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

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
                }
            }
        })
    }
   
    public add(card: CardModel, position?: number) {
        const order = this.draft.refer.order;
        if (position === -1) position = order.length;
        if (!position) position = order.length;

        let cards: CardModel[] | undefined;
        if (card instanceof SpellCardModel) cards = this.draft.child.spells;
        if (card instanceof MinionCardModel) cards = this.draft.child.minions;
        if (card instanceof WeaponCardModel) cards = this.draft.child.weapons;
        if (!cards) return;
        
        cards.push(card);
        order.splice(position, 0, card);
        return card;
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
        if (index !== -1) cards.splice(index, 1);
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);

        this.draft.child.cache.push(card);
    }

    public del(card: CardModel): CardModel | undefined {
        const cache = this.draft.child.cache;
        const index = cache.indexOf(card);
        if (index === -1) return;
        cache.splice(index, 1);
        return card;
    }
}