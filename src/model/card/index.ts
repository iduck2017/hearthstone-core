import { DebugUtil, Model, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { BattlecryModel } from "../hooks/battlecry";
import { HandModel } from "../player/hand";
import { DeckModel } from "../player/deck";
import { BoardModel } from "../player/board";
import { GraveyardModel } from "../player/graveyard";
import { SelectUtil } from "../../utils/select";
import { CardHooksModel } from "./hooks";
import { AnchorModel } from "../..";
import { AbortEvent } from "../../utils/abort";

export type PlayEvent = {
    battlecry: Map<BattlecryModel, Model[]>;
}

export namespace CardModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
    };
    export type Event = {
        toPlay: AbortEvent;
        toDraw: AbortEvent;
        onPlay: {};
        onDraw: { card: CardModel },
    };
    export type Child = {
        readonly hooks: CardHooksModel;
        readonly anchor: AnchorModel;
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
                hooks: new CardHooksModel({}),
                anchor: new AnchorModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }


    public abstract play(): Promise<void>;
    
    protected async onPlay(event: PlayEvent) {
        this.event.onPlay({});
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) return;
            await item.run(...params);
        }
    }

    protected async toPlay(): Promise<PlayEvent | undefined> {
        const event: PlayEvent = {
            battlecry: new Map(),
        };
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const selectors = item.toRun();
            if (!selectors) continue;
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                if (result === undefined) return;
                params.push(result);
            }
            event.battlecry.set(item, params);
        }
        return event;
    }


    @DebugUtil.log()
    public draw() {
        const event = this.event.toDraw(new AbortEvent());
        if (event.isAbort) return;
        const card = this.doDraw();
        if (!card) return;
        this.event.onDraw({ card });
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


    @DebugUtil.log()
    public async clear() {
        this.doClear();
        const hooks = this.child.hooks;
        const deathrattle = hooks.child.deathrattle;
        for (const item of deathrattle) {
            await item.run();
        }
    }
    
    public abstract doClear(): void;
}