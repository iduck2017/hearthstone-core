import { Model, TemplUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CardModel } from "../../..";

export namespace HandModel {
    export type E = {}
    export type S = {}
    export type C = {   
        cards: CardModel[]
    }
    export type R = {}
}

@TemplUtil.is('hand')
export class HandModel extends Model<
    HandModel.E,
    HandModel.S,
    HandModel.C,
    HandModel.R
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
        const player = this.route.player;  
        if (!player) return;
        const isCurrent = player.state.isCurrent;
        return {
            cards: isCurrent ? this.child.cards.map(item => item.chunk) : undefined,
            size: this.child.cards.length,
        }
    }

    constructor(props?: HandModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            child: { 
                cards: props.child?.cards ?? [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer },
        })
    }
   
    @TranxUtil.span()
    public add(card: CardModel, position?: number) {
        const child = this.origin.child;
        if (position === -1) position = child.cards.length;
        if (position === undefined) position = child.cards.length;
        child.cards.splice(position, 0, card);
    }

    
    @TranxUtil.span()
    public del(card: CardModel) {
        const cards = this.origin.child.cards;
        const index = cards.indexOf(card);
        if (index === -1) return;
        cards.splice(index, 1);
    }

    public has(card: CardModel): boolean {
        const cards = this.origin.child.cards;
        return cards.includes(card);
    }
}