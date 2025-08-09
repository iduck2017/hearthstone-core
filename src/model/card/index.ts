import { DebugUtil, Model, TranxUtil } from "set-piece";
import { CardType } from "../../types";
import { PlayerModel } from "../player";
import { DamageModel } from "./damage";
import { GameModel } from "../game";
import { CardHooksModel } from "./hooks";
import { BattlecryModel } from "./hooks/battlecry";
import { HandModel } from "../player/hand";
import { DeckModel } from "../player/deck";
import { BoardModel } from "../player/board";
import { GraveyardModel } from "../player/graveyard";

export type PlayForm = {
    battlecry: Map<BattlecryModel, Model[]>;
}

export namespace CardModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
        readonly type: CardType;
    };
    export type Event = {
        toPlay: { isAbort: boolean };
        toDraw: { isAbort: boolean };
        onPlay: {};
        onDraw: { card: CardModel },
        onRemove: {};
    };
    export type Child = {
        readonly damage: DamageModel;
        readonly hooks: CardHooksModel;
    };
    export type Refer = {};
}

export abstract class CardModel<
    E extends Partial<CardModel.Event> & Model.Event = {},
    S extends Partial<CardModel.State> & Model.State = {},
    C extends Partial<CardModel.Child> & Model.Child = {},
    R extends Partial<CardModel.Refer> & Model.Refer = {}
> extends Model<
    E & CardModel.Event, 
    S & CardModel.State, 
    C & CardModel.Child,
    R & CardModel.Refer
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            game: route.path.find(item => item instanceof GameModel),
            hand: route.path.find(item => item instanceof HandModel),
            deck: route.path.find(item => item instanceof DeckModel),
            board: route.path.find(item => item instanceof BoardModel),
            player: route.path.find(item => item instanceof PlayerModel),
            graveyard: route.path.find(item => item instanceof GraveyardModel),
        }
    }
    
    public get refer() {
        const player = this.route.player;
        return {
            ...super.refer,
            hand: player?.child.hand,
            deck: player?.child.deck,
            board: player?.child.board,
            graveyard: player?.child.graveyard,
        }
    }

    constructor(props: CardModel['props'] & {
        uuid: string | undefined;
        state: S & CardModel.State;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                damage: new DamageModel({}),
                hooks: new CardHooksModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public abstract play(): Promise<void>;

    @DebugUtil.log()
    public draw() {
        const { isAbort } = this.event.toDraw({ isAbort: false });
        if (isAbort) return;
        const card = this.doDraw();
        if (!card) return;
        this.event.onDraw({ card });
    }

    @TranxUtil.span()
    protected doDraw() {
        const { player } = this.route;
        if (!player) return;
        let result = player.child.deck.del(this);
        if (!result) return;
        result = player.child.hand.add(result);
        return result;
    }


    @DebugUtil.log()
    public async remove() {
        this.doRemove();
        this.event.onRemove({});
        const hooks = this.child.hooks;
        for (const item of hooks.child.deathrattle) {
            await item.run();
        }
    }

    public abstract doRemove(): void;

    
    protected async onPlay(form: PlayForm) {
        this.event.onPlay({});
        const hooks = this.child.hooks;
        for (const item of hooks.child.battlecry) {
            const params = form.battlecry.get(item);
            if (!params) return;
            await item.run(...params);
        }
    }
}