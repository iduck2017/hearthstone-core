import { DebugUtil, Event, Model, TranxUtil } from "set-piece";
import { AbortEvent, GameModel, PlayerModel } from "../../..";
import { MinionCardModel } from "../cards/minion";
import { CardModel } from "../cards";
import { SecretCardModel } from "../../..";

export namespace BoardModel {
    export type E = {
        toSummon: AbortEvent<{ minion: MinionCardModel }>;
        onSummon: Event<{ minion: MinionCardModel }>;
    };
    export type S = {};
    export type C = {
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

    public get state() {
        const result = super.state;
        return {
            ...result,
            isOverflow: this.child.cards.length >= 7,
        }
    }

    public get chunk() {
        return {
            cards: this.child.cards.map(item => item.chunk),
            size: this.child.cards.length,
        }
    }

    public get refer() {
        const child = super.child;
        const refer = super.refer;
        const minions: MinionCardModel[] = child.cards
            .map(item => item instanceof MinionCardModel ? item : undefined)
            .filter(item => item !== undefined);
        return {
            ...refer,
            minions,
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

    public summon(minion: MinionCardModel, to?: number): void {
        if (this.state.isOverflow) return;

        const hand = minion.route.hand;
        if (hand && !hand.has(minion)) return;
        const deck = minion.route.deck;
        if (deck && !deck.has(minion)) return;
        const cache = minion.route.cache;
        if (cache && !cache.has(minion)) return;

        const event = new AbortEvent({ minion });
        this.event.toSummon(event);
        let isValid = event.detail.isValid;
        if (!isValid) return;

        const length = this.child.cards.length;
        if (to === undefined) to = length;
        if (to < 0) to = length;

        this.doSummon(minion, to);

        DebugUtil.log(`${minion.name} Summoned`);
        this.event.onSummon(new Event({ minion }));
    }

    @TranxUtil.span()
    protected doSummon(minion: MinionCardModel, to: number): void {
        const hand = minion.route.hand;
        if (hand) hand.del(minion);
        const deck = minion.route.deck;
        if (deck) deck.del(minion);
        const cache = minion.route.cache;
        if (cache) cache.del(minion);
        this.add(minion, to);
    }


    public add(card: SecretCardModel): void
    public add(card: MinionCardModel, position?: number): void
    public add(card: CardModel, position?: number): void {
        let cards: CardModel[] | undefined
        if (card instanceof SecretCardModel) cards = this.origin.child.secrets;
        if (card instanceof MinionCardModel) cards = this.origin.child.cards;
        if (!cards) return;
        if (position === -1) position = cards.length;
        if (position === undefined) position = cards.length;
        cards.splice(position, 0, card);
    }


    public del(card: SecretCardModel): void
    public del(card: MinionCardModel): void
    public del(card: CardModel) {
        let cards: CardModel[] | undefined
        if (card instanceof SecretCardModel) cards = this.origin.child.secrets;
        if (card instanceof MinionCardModel) cards = this.origin.child.cards;
        if (!cards) return;
        const index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
    }

    public has(card: CardModel): boolean {
        const cards = this.origin.child.cards;
        const secrets = this.origin.child.secrets;

        if (cards.includes(card)) return true;
        if (card instanceof SecretCardModel) {
            if (secrets.includes(card)) return true;
        }
        return false;
    }
}