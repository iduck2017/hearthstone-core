import { DebugUtil, Model, TranxUtil, Event, Method, Route } from "set-piece";
import { CostModel } from "../rules/card/cost";
import { ClassType, RarityType } from "../../types/card-enums";
import { MinionFeaturesModel } from "../features/group/minion";
import { DamageModel, DisposeModel, FeatureModel, RestoreModel } from "../..";
import { MinionCardModel, PlayerModel, GameModel, HandModel, DeckModel, BoardModel, GraveyardModel } from "../..";
import { DeployModel } from "../rules/deploy";
import { PerformModel } from "../rules/perform";
import { CardFeaturesModel } from "../features/group/card";

export namespace CardModel {
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
        readonly feats: CardFeaturesModel;
        readonly damage: DamageModel
        readonly restore: RestoreModel
        readonly deploy?: DeployModel;
        readonly dispose?: DisposeModel;
        readonly perform: PerformModel;
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
    public get route(): Route & Partial<{
        hand: HandModel;
        player: PlayerModel;
        deck: DeckModel;
        board: BoardModel;
        graveyard: GraveyardModel;
        minion: MinionCardModel;
        game: GameModel;
    }> {
        const result = super.route;
        return {
            ...result,
            hand: result.list.find(item => item instanceof HandModel),
            player: result.list.find(item => item instanceof PlayerModel),
            deck: result.list.find(item => item instanceof DeckModel),
            board: result.list.find(item => item instanceof BoardModel),
            graveyard: result.list.find(item => item instanceof GraveyardModel),
            minion: result.list.find(item => item instanceof MinionCardModel),
            game: result.list.find(item => item instanceof GameModel),
        }
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

    public get name(): string { return String(this.state.name); }

    constructor(props: CardModel['props'] & {
        state: S & Pick<CardModel.S, 'desc' | 'name' | 'flavorDesc' | 'class' | 'rarity' | 'isCollectible'>,
        child: C & Pick<CardModel.C, 'cost' | 'perform' | 'dispose' | 'feats'>,
        refer: R & CardModel.R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: false,
                ...props.state
            },
            child: { 
                damage: props.child.damage ?? new DamageModel(),
                restore: props.child.restore ?? new RestoreModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        })
    }

    // play
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
        mana.consume(cost.state.current, this);
        // use
        const hand = player.child.hand;
        const from = hand.refer.queue.indexOf(this);
        if (from === undefined) return;
        hand.drag(this);
        const perform = this.child.perform;
        // run
        await perform.run(from, ...params);
        // try to dispose if not perform
        this.clear();
    }

    @TranxUtil.span()
    private clear() {
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        // already removed from hand
        if (!hand.drop(this)) return;
        const graveyard = player.child.graveyard;
        graveyard.add(this);
    }


    // draw
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
        deck.del(this);
        player.child.hand.add(this);
        return true;
    }
}