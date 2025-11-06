import { Model, TemplUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "../../player";
import { GameModel } from "../../game";
import { CardModel } from "../../..";

export namespace HandModel {
    export type E = {}
    export type S = {}
    export type C = {   
        cards: CardModel[]
        current: CardModel[]
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
        const game = this.route.game;
        if (!game) return;
        const turn = game.child.turn;
        const current = turn.refer.current;
        const isCurrent = current === player;
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
                current: props.child?.current ?? [],
                ...props.child,
            },
            state: { ...props.state },
            refer: { ...props.refer },
        })
    }
   
    @TranxUtil.span()
    public add(card: CardModel, position?: number, options?: {
        isClone: boolean
        isProto: boolean
    }) {
        if (position === -1) position = this.child.cards.length;
        if (position === undefined) position = this.child.cards.length;
        if (options?.isClone) {
            const copy = TemplUtil.copy(card, {
                refer: { ...card.props.refer, creator: card },
            });
            if (!copy) return;
            card = copy;
        }
        this.origin.child.current.splice(position, 0, card);
    }

    @TranxUtil.span()
    public drag(card: CardModel) {
        const index = this.child.current.indexOf(card);
        if (index === -1) return;
        this.origin.child.current.splice(index, 1);
        this.origin.child.current.push(card);
    }

    @TranxUtil.span()
    public drop(card: CardModel): boolean {
        // remove from cache
        const cache = this.origin.child.cards ?? [];
        let index = cache.indexOf(card);
        if (index === -1) return false;
        cache.splice(index, 1);
        return true;
    }

    @TranxUtil.span()
    public del(card: CardModel) {
        const index = this.child.current.indexOf(card);
        if (index === -1) return;
        this.origin.child.cards.push(card);
    }
}