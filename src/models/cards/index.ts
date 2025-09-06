import { DebugUtil, Model, TranxUtil, Props, Event, Method } from "set-piece";
import { CostModel, CostType } from "../rules/cost";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { HandModel } from "../containers/hand";
import { DeckModel } from "../containers/deck";
import { BoardModel } from "../containers/board";
import { GraveyardModel } from "../containers/graveyard";
import { ClassType, RarityType } from "../../types/card";

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
    };
    export type C = {
        readonly cost: CostModel;
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
   R & CardProps.R
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
            /** current position */
            hand: route.order.find(item => item instanceof HandModel),
            deck: route.order.find(item => item instanceof DeckModel),
            board: route.order.find(item => item instanceof BoardModel),
            graveyard: route.order.find(item => item instanceof GraveyardModel),
        }
    }

    constructor(loader: Method<CardModel['props'] & {
        state: S & CardProps.S,
        child: C & Pick<CardProps.C, 'cost'>,
        refer: R & CardProps.R,
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    public abstract play(): Promise<void>;
    
    public check(): boolean {
        const player = this.route.player;
        if (!player) return false;
        if (!player.check()) return false;
        const cost = this.child.cost;
        if (!cost.check()) return false;
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