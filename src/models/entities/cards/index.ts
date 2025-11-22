import { DebugUtil, Model, TranxUtil, Event, Method, Route, TemplUtil, Emitter } from "set-piece";
import { CostModel } from "../../rules/cost";
import { ClassType, RarityType } from "../../../types/card";
import { AbortEvent, AppModel, CardFeatureModel, DamageModel, DisposeModel, LibraryUtil, PoisonousModel, RestoreModel, TurnEndModel, TurnStartModel } from "../../..";
import { PlayerModel, GameModel, HandModel, DeckModel, BoardModel, GraveyardModel } from "../../..";
import { PerformModel } from "../../rules/perform";
import { CacheModel } from "../containers/cache";

export namespace CardModel {
    export type E = {
        toDraw: AbortEvent;
        onDraw: Event;
    };
    export type S = {
        readonly name: string;
        readonly desc: string;
        readonly flavorDesc: string;
        readonly class: ClassType;
        readonly rarity: RarityType;
        readonly isCollectible: boolean;
    };
    export type C = {
        readonly cost: CostModel;
        readonly damage: DamageModel
        readonly restore: RestoreModel

        readonly perform: PerformModel;
        readonly dispose?: DisposeModel;
        // entries
        readonly poisonous: PoisonousModel;
        // feats
        readonly feats: CardFeatureModel[];
        // hooks
        readonly turnStart: TurnStartModel[];
        readonly turnEnd: TurnEndModel[];
    };
    export type R = {
        creator?: Model;
    };
}


@TranxUtil.span(true)
export abstract class CardModel<
    E extends Partial<CardModel.E> & Model.E = {},
    S extends Partial<CardModel.S> & Model.S = {},
    C extends Partial<CardModel.C> & Model.C = {},
    R extends Partial<CardModel.R> & Model.R = {}
> extends Model<
   E & CardModel.E,
   S & CardModel.S,
   C & CardModel.C,
   R & CardModel.R
> {
    public get chunk() {
        const board = this.route.board;
        const hand = this.route.hand;
        const feats = this.child.feats.map(item => item.chunk);
        if (board || hand) {
            return {
                uuid: this.uuid,
                name: this.state.name,
                class: this.state.class,
                rarity: this.state.rarity,
                cost: this.child.cost.state.current,
                feats: feats.length ? feats : undefined,
                poisonous: this.child.poisonous?.state.isActived || undefined,
            }
        } 
        return {
            name: this.state.name,
            desc: this.state.desc,
            class: this.state.class,
            rarity: this.state.rarity,
            cost: this.child.cost.state.current,
        }
    }

    public get route(): Route & Partial<{
        hand: HandModel;
        player: PlayerModel;
        deck: DeckModel;
        board: BoardModel;
        graveyard: GraveyardModel;
        game: GameModel;
        app: AppModel;
        cache: CacheModel;
    }> {
        const result = super.route;
        const board = result.items.find(item => item instanceof BoardModel);
        const hand = result.items.find(item => item instanceof HandModel);
        const deck = result.items.find(item => item instanceof DeckModel);
        const cache = result.items.find(item => item instanceof CacheModel);
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            graveyard: result.items.find(item => item instanceof GraveyardModel),
            game: result.items.find(item => item instanceof GameModel),
            app: result.items.find(item => item instanceof AppModel),
            board,
            hand,
            deck,
            cache,
        }
    }

    public get status(): boolean {
        return true;
    }

    public get name(): string { return String(this.state.name); }

    constructor(props: CardModel['props'] & {
        state: S & Pick<CardModel.S, 'desc' | 'name' | 'flavorDesc' | 'class' | 'rarity' | 'isCollectible'>,
        child: C & Pick<CardModel.C, 'cost' | 'dispose' | 'feats' | 'perform'>,
        refer: R & CardModel.R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                damage: props.child.damage ?? new DamageModel(),
                restore: props.child.restore ?? new RestoreModel(),
                poisonous: props.child.poisonous ?? new PoisonousModel({ state: { isActived: false }}),
                turnStart: props.child.turnStart ?? [],
                turnEnd: props.child.turnEnd ?? [],
                ...props.child 
            },
            refer: { ...props.refer },
        })
    }

    // play
    public async play() {
        await this.child.perform.run();
    }

    // draw
    public draw() {
        // before
        const deck = this.route.deck;
        if (!deck) return;

        const event = new AbortEvent({});
        this.event.toDraw(event);
        let isValid = event.detail.isValid;
        if (!isValid) return;

        // execute
        isValid = this.doDraw();
        if (!isValid) return;
        
        // after
        DebugUtil.log(`${this.name} Drew`);
        this.event.onDraw(new Event({}));
    }

    @TranxUtil.span()
    private doDraw(): boolean {
        const player = this.route.player;
        if (!player) return false;

        const deck = player.child.deck;
        deck.del(this);

        const hand = player.child.hand;
        hand.add(this);
        return true;
    }



    // clone
    public clone<T extends CardModel>(this: T, original?: boolean): T | undefined {
        const copy = TemplUtil.copy(this, {
            state: original ? {} : { ...this.props.state },
            child: original ? {} : { ...this.props.child },
            refer: { ...this.props.refer, creator: this },
        });
        if (!copy) return;

        const app = this.route.app;
        if (!app) return;
        const cache = app.child.cache;
        cache.add(copy);
        return copy;
    }
}