import { DebugUtil, Model, TranxUtil, Props, Event, Method, StoreUtil } from "set-piece";
import { CostModel } from "../rules/cost";
import { ClassType, RarityType } from "../../types/card";
import { MinionHooksModel } from "../hooks/minion";
import { DamageModel, DeathrattleModel, DisposeModel, FeatureModel, RestoreModel } from "../..";
import { MinionCardModel, PlayerModel, GameModel, HandModel, DeckModel, BoardModel, GraveyardModel } from "../..";
import { DeployModel } from "../rules/deploy";
import { PerformModel } from "../rules/perform";

export namespace CardProps {
    export type E = {
        onPlay: Event,
        onDraw: Event,
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
        readonly feats: FeatureModel[];
        readonly damage: DamageModel
        readonly restore: RestoreModel
        readonly deploy?: DeployModel;
        readonly dispose?: DisposeModel;
        readonly perform: PerformModel;
    };
    export type P = {
        minion: MinionCardModel;
        player: PlayerModel;
        deck: DeckModel;
        hand: HandModel;
        board: BoardModel;
        game: GameModel;
        graveyard: GraveyardModel;
    };
    export type R = {
        creator?: Model;
    };
}

export abstract class CardModel<
    E extends Partial<CardProps.E> & Props.E = {},
    S extends Partial<CardProps.S> & Props.S = {},
    C extends Partial<CardProps.C> & Props.C = {},
    R extends Partial<CardProps.R> & Props.R = {}
> extends Model<
   E & CardProps.E,
   S & CardProps.S,
   C & CardProps.C,
   R & CardProps.R,
   CardProps.P
> {
    public static copy<M extends CardModel>(card: M): M | undefined {
        const result = StoreUtil.copy(card, {
            refer: { ...card.props.refer, creator: card },
        });
        return result;
    }

    public get status(): boolean {
        const hand = this.route.hand;
        if (!hand) return false;
        const player = this.route.player;
        if (!player) return false;
        if (!player.status) return false;
        const cost = this.child.cost;
        if (!cost.status) return false;
        return true;
    }

    constructor(loader: Method<CardModel['props'] & {
        state: S & Omit<CardProps.S, 'isActive'>,
        child: C & Pick<CardProps.C, 'cost' | 'perform' | 'dispose'>,
        refer: R & CardProps.R,
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    isActive: false,
                    ...props.state
                },
                child: { 
                    feats: [],
                    hooks: props.child.hooks ?? new MinionHooksModel(),
                    damage: props.child.damage ?? new DamageModel(),
                    restore: props.child.restore ?? new RestoreModel(),
                    ...props.child 
                },
                refer: { ...props.refer },
                route: {
                    deck: DeckModel.prototype,
                    hand: HandModel.prototype,
                    board: BoardModel.prototype,
                    graveyard: GraveyardModel.prototype,
                    player: PlayerModel.prototype,
                    minion: MinionCardModel.prototype,
                    game: GameModel.prototype,
                }
            }
        })
    }

    public async play() {
        if (!this.status) return;
        const perform = this.child.perform;
        const params = await perform.toRun();
        // cancel by user
        if (!params) return;
        await this.doPlay(...params);
        await this.event.onPlay(new Event({}));
    }

    protected async doPlay(...params: any[]) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.use(cost.state.current, this);
        // use
        const hand = player.child.hand;
        const from = hand.refer.order.indexOf(this);
        hand.use(this);
        const perform = this.child.perform;
        // run
        await perform.run(from, ...params);
        // try to dispose if not perform
        this.dispose();
    }

    @TranxUtil.span()
    private dispose() {
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        if (!hand.del(this)) return;
        const graveyard = player.child.graveyard;
        graveyard.add(this);
    }


    @DebugUtil.log()
    public draw() {
        if (!this.doDraw()) return;
        this.event.onDraw(new Event({}));
    }

    @TranxUtil.span()
    protected doDraw(): boolean {
        const player = this.route.player;
        if (!player) return false;
        const deck = player.child.deck;
        if (!deck.del(this)) return false;
        player.child.hand.add(this);
        return true;
    }
}