import { DebugUtil, Model, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { BattlecryModel } from "../hooks/battlecry";
import { HandModel } from "../player/hand";
import { DeckModel } from "../player/deck";
import { BoardModel } from "../player/board";
import { GraveyardModel } from "../player/graveyard";
import { DeathrattleModel } from "../hooks/deathrattle";
import { StartTurnHookModel } from "../hooks/start-turn";
import { EndTurnHookModel } from "../hooks/end-turn";
import { DamageModel } from "../heroes/damage";
import { SelectUtil } from "../../utils/select";

export type PlayForm = {
    battlecry: Map<BattlecryModel, Model[]>;
}

export namespace CardModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
    };
    export type Event = {
        toPlay: { isAbort: boolean };
        toDraw: { isAbort: boolean };
        onPlay: {};
        onDraw: { card: CardModel },
        onDispose: {};
    };
    export type Child = {
        readonly battlecryHooks: BattlecryModel[];
        readonly deathrattleHooks: DeathrattleModel[];
        readonly startTurnHooks: StartTurnHookModel[];
        readonly endTurnHooks: EndTurnHookModel[];
        readonly damage: DamageModel;
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
                battlecryHooks: [],
                deathrattleHooks: [],
                startTurnHooks: [],
                endTurnHooks: [],
                damage: new DamageModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }


    /**  play card */
    public abstract play(): Promise<void>;

    protected async onPlay(form: PlayForm) {
        this.event.onPlay({});
        for (const item of this.child.battlecryHooks) {
            const params = form.battlecry.get(item);
            if (!params) return;
            await item.run(...params);
        }
    }

    protected async toPlay(): Promise<PlayForm | undefined> {
        const form: PlayForm = {
            battlecry: new Map(),
        };
        for (const feature of this.child.battlecryHooks) {
            const selectors = feature.toRun();
            if (!selectors) continue;
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                if (result === undefined) return;
                params.push(result);
            }
            form.battlecry.set(feature, params);
        }
        return form;
    }

    /** draw card */
    @DebugUtil.log()
    public draw() {
        const signal = this.event.toDraw({ isAbort: false });
        if (signal.isAbort) return;
        const card = this.doDraw();
        if (!card) return;
        this.event.onDraw({ card });
    }

    @TranxUtil.span()
    protected doDraw() {
        const player = this.route.player;
        if (!player) return;
        let result = player.child.deck.del(this);
        if (!result) return;
        result = player.child.hand.add(result);
        return result;
    }

    /** dispose */
    @DebugUtil.log()
    public async dispose() {
        this.doDispose();
        this.event.onDispose({});
        for (const item of this.child.deathrattleHooks) {
            await item.run();
        }
    }
    
    public abstract doDispose(): void;
}