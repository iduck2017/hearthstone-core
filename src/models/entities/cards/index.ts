import { DebugUtil, Model, TranxUtil, Event, Method, Route, TemplUtil, Emitter } from "set-piece";
import { CostModel } from "../../rules/cost";
import { ClassType, RarityType } from "../../../types/card";
import { AbortEvent, AppModel, DamageModel, DisposeModel, FeatureModel, LibraryUtil, PoisonousModel, RestoreModel, TurnEndModel, TurnStartModel } from "../../..";
import { PlayerModel, GameModel, HandModel, DeckModel, BoardModel, GraveyardModel } from "../../..";
import { CardPerformModel } from "../../rules/perform/card";
import { CacheModel } from "../containers/cache";

export namespace CardModel {
    export type E = {
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

        readonly perform: CardPerformModel;
        readonly dispose?: DisposeModel;
        // entries
        readonly poisonous: PoisonousModel;
        // feats
        readonly feats: FeatureModel[];
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
                poisonous: this.child.poisonous?.state.isEnabled || undefined,
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
        const graveyard = result.items.find(item => item instanceof GraveyardModel);
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
            app: result.items.find(item => item instanceof AppModel),
            graveyard,
            board,
            hand,
            deck,
            cache,
        }
    }

    protected get container(): BoardModel | HandModel | DeckModel | CacheModel | GraveyardModel | undefined {
        const board = this.route.board;
        const hand = this.route.hand;
        const deck = this.route.deck;
        const cache = this.route.cache;
        const graveyard = this.route.graveyard;
        if (board) return board;
        if (hand) return hand;
        if (deck) return deck;
        if (graveyard) return graveyard;
        if (cache) return cache;
        return undefined;
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
                poisonous: props.child.poisonous ?? new PoisonousModel({ state: { isEnabled: false }}),
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
        const player = this.route.player;
        if (!player) return;
        player.child.hand.draw(this);
    }

    // clone
    @TranxUtil.span()
    public clone<T extends CardModel>(this: T, isProto?: boolean): T | undefined {
        const copy = TemplUtil.copy(this, {
            state: isProto ? {} : { ...this.props.state },
            child: isProto ? {} : { ...this.props.child },
            refer: { ...this.props.refer, creator: this },
        });
        if (!copy) return;

        const app = this.route.app;
        if (!app) return;
        const cache = app.child.cache;
        cache.add(copy);

        DebugUtil.log(`${copy.name} Cloned`);
        return copy;
    }
}