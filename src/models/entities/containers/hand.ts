import { DebugUtil, Event, Model, TemplUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { AbortEvent, CardModel } from "../../..";

export namespace HandModel {
    export type E = {
        toDraw: AbortEvent<{ card: CardModel }>;
        onDraw: Event<{ card: CardModel }>; 
        toGain: AbortEvent<{ card: CardModel }>;
        onGain: Event<{ card: CardModel }>;
    }
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


    public get state() {
        return {
            ...super.state,
            isEmpty: this.child.cards.length === 0,
            isOverflow: this.child.cards.length >= 10,
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

    public draw(card?: CardModel) {
        if (this.state.isOverflow) return;

        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;

        if (!card) card = deck.child.cards[0];
        if (!card) return;
        if (!card.route.deck) return;

        const event = new AbortEvent({ card });
        this.event.toDraw(event);
        let isValid = event.detail.isValid;
        if (!isValid) return;

        isValid = Boolean(this.gain(card));
        if (!isValid) return;

        DebugUtil.log(`${card.name} Drew`);
        this.event.onDraw(new Event({ card }));
        return card;
    }

    public gain(card: CardModel) {
        if (this.state.isOverflow) return;

        const hand = card.route.hand;
        if (hand && !hand.has(card)) return;
        const deck = card.route.deck;
        if (deck && !deck.has(card)) return;
        const cache = card.route.cache;
        if (cache && !cache.has(card)) return;

        const event = new AbortEvent({ card });
        this.event.toGain(event);
        let isValid = event.detail.isValid;
        if (!isValid) return;

        this.doGain(card);

        DebugUtil.log(`${card.name} Gained`);
        this.event.onGain(new Event({ card }));

        return card;
    }

    @TranxUtil.span()
    protected doGain(card: CardModel) {
        const hand = card.route.hand;
        if (hand) hand.del(card);
        const deck = card.route.deck;
        if (deck) deck.del(card);
        const cache = card.route.cache;
        if (cache) cache.del(card);
        this.add(card);
    }

}