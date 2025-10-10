import { Model, TemplUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "./player";
import { GameModel } from "./game";
import { CardModel } from "..";
import { WeaponCardModel, MinionCardModel, SpellCardModel } from "..";

export namespace HandModel {
    export type E = {}
    export type S = {}
    export type C = {
        cache: CardModel[],
        spells: SpellCardModel[],
        minions: MinionCardModel[],
        weapons: WeaponCardModel[],
    }
    export type P = {
        game: GameModel;
        player: PlayerModel;
    };
    export type R = {
        order: CardModel[]
    }
}

@TemplUtil.is('hand')
export class HandModel extends Model<
    HandModel.E,
    HandModel.S,
    HandModel.C,
    HandModel.R
> {
    constructor(props?: HandModel['props']) {
        props = props ?? {};
        super({
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
                order: [
                    ...props.child?.minions ?? [],
                    ...props.child?.weapons ?? [],
                    ...props.child?.spells ?? [],
                ],
                ...props.refer 
            },
        })
    }

    public query(card: CardModel): CardModel[] | undefined {
        if (card instanceof SpellCardModel) return this.origin.child.spells;
        if (card instanceof MinionCardModel) return this.origin.child.minions;
        if (card instanceof WeaponCardModel) return this.origin.child.weapons;
    }
   
    @TranxUtil.span()
    public add(card: CardModel, position?: number) {
        let cards = this.query(card);
        if (!cards) return;
        cards.push(card);

        const order = this.origin.refer.order ?? [];
        if (position === -1) position = order.length;
        if (!position) position = order.length;
        order.splice(position, 0, card);
    }

    
    @TranxUtil.span()
    public copy(origin: CardModel) {
        const copy = TemplUtil.copy(origin, {
            refer: { ...origin.props.refer, creator: origin },
        });
        if (!copy) return;
        this.add(copy);
    }

    @TranxUtil.span()
    public prepare(card: CardModel) {
        let cards = this.query(card);
        if (!cards) return;
        let index = cards.indexOf(card);
        if (index === -1) return;
        cards.splice(index, 1);

        const order = this.origin.refer.order ?? [];
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);

        this.origin.child.cache.push(card);
    }

    @TranxUtil.span()
    public use(card: CardModel): boolean {
        // remove from cache
        const cache = this.origin.child.cache ?? [];
        let index = cache.indexOf(card);
        if (index === -1) return false;
        cache.splice(index, 1);
        return true;
    }

    @TranxUtil.span()
    public del(card: CardModel) {
        // remove from cards
        let cards = this.query(card) ?? [];
        let index = cards.indexOf(card);
        if (index === -1) return;
        cards.splice(index, 1);
        
        // remove from order
        const order = this.origin.refer.order ?? [];
        index = order.indexOf(card);
        if (index === -1) return;
        order.splice(index, 1);
    }
}