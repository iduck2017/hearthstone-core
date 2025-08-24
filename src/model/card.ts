import { DebugUtil, Model, TranxUtil } from "set-piece";
import { PlayerModel } from "./players";
import { GameModel } from "./game";
import { BattlecryModel } from "./hooks/battlecry";
import { HandModel } from "./containers/hand";
import { DeckModel } from "./containers/deck";
import { BoardModel } from "./containers/board";
import { GraveyardModel } from "./containers/graveyard";
import { SelectEvent, SelectUtil } from "../utils/select";
import { CardHooksModel } from "./hooks";
import { AnchorModel, HeroModel, MinionModel, RoleModel } from "..";
import { AbortEvent } from "../utils/abort";
import { CostModel } from "./rules/cost";
import { WeaponModel } from "./weapon";

export type PlayEvent = {
    battlecry: Map<BattlecryModel, Model[]>;
}

export enum RarityType {
    COMMON = 1,
    RARE,
    EPIC,
    LEGENDARY,
}

export enum ClassType {
    WARRIOR = 1,
    MAGE,
    NEUTRAL,
}

export namespace CardModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly flavorDesc: string;
        readonly rarity: RarityType;
        readonly class: ClassType;
    };
    export type Event = {
        toPlay: AbortEvent;
        toDraw: AbortEvent;
        onPlay: {};
        onDraw: { card: CardModel },
    };
    export type Child = {
        readonly cost: CostModel;
        readonly hooks: CardHooksModel;
        readonly anchor: AnchorModel;

        readonly hero?: HeroModel;
        readonly minion?: MinionModel;
        readonly weapon?: WeaponModel;
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
            player: route.path.find(item => item instanceof PlayerModel),
            /** should be here */
            hand: route.path.find(item => item instanceof HandModel),
            deck: route.path.find(item => item instanceof DeckModel),
            board: route.path.find(item => item instanceof BoardModel),
            graveyard: route.path.find(item => item instanceof GraveyardModel),
        }
    }

    constructor(props: CardModel['props'] & {
        uuid: string | undefined;
        state: S & CardModel.State;
        child: C & Pick<CardModel.Child, 'cost'>;
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

    public async play() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const minion = this.child.minion;
        const position = await minion?.toSummon();
        const event = await this.toPlay();
        if (!event) return;
        minion?.doSummon(board, position);
        await this.onPlay(event);
        minion?.onSummon();
    }

    private async toPlay() {
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        const event: PlayEvent = {
            battlecry: new Map(),
        };
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

    private async onPlay(event: PlayEvent) {
        this.event.onPlay({});
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) return;
            await item.run(...params);
        }
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
        const minion = this.child.minion;
        minion?.clear();
        const hooks = this.child.hooks;
        const deathrattle = hooks.child.deathrattle;
        for (const item of deathrattle) await item.run();
    }
}