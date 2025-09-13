import { DebugUtil, Model, TranxUtil, Props, Event, Method, Format } from "set-piece";
import { CostModel } from "../rules/cost";
import { ClassType, RarityType } from "../../types/card";
import { MinionHooksModel } from "../hooks/minion";
import { DamageModel, RestoreModel } from "../..";
import { MinionCardModel, PlayerModel, GameModel, HandModel, DeckModel, BoardModel, GraveyardModel } from "../..";
import { CardFeatureModel } from "../features/card";

export namespace CardProps {
    export type E = {
        toPlay: Event;
        toDraw: Event;
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
        readonly isActive: boolean;
    };
    export type C = {
        readonly cost: CostModel;
        readonly feats: CardFeatureModel[];
        readonly damage: DamageModel
        readonly restore: RestoreModel
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
    export type R = {};
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
    public get state(): Readonly<Format.State<S & CardProps.S>> {
        const state = super.state;
        return {
            ...state,
            isActive: this.check(),
        }
    }

    constructor(loader: Method<CardModel['props'] & {
        state: S & Omit<CardProps.S, 'isActive'>,
        child: C & Pick<CardProps.C, 'cost'>,
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

    public abstract play(): Promise<void>;

    private check(): boolean {
        const hand = this.route.hand;
        if (!hand) return false;
        const player = this.route.player;
        if (!player) return false;
        if (!player.state.isActive) return false;
        const cost = this.child.cost;
        if (!cost.state.isActive) return false;
        return true;
    }

    @DebugUtil.log()
    public draw() {
        const event = this.event.toDraw(new Event({}));
        if (event.isCancel) return;
        const card = this.doDraw();
        if (!card) return;
        this.event.onDraw(new Event({}));
    }

    @TranxUtil.span()
    protected doDraw() {
        const player = this.route.player;
        if (!player) return;
        let card = player.child.deck.del(this);
        if (!card) return;
        card = player.child.hand.add(card);
        return card;
    }
}