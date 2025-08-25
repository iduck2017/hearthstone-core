import { DebugUtil, Model, TranxUtil } from "set-piece";
import { PlayerModel } from "../players";
import { GameModel } from "../game";
import { BattlecryModel } from "../hooks/battlecry";
import { HandModel } from "../containers/hand";
import { DeckModel } from "../containers/deck";
import { BoardModel } from "../containers/board";
import { GraveyardModel } from "../containers/graveyard";
import { SelectUtil } from "../../utils/select";
import { CardHooksModel } from "../hooks/card-hooks";
import { AnchorModel, FeaturesModel, HeroModel, MinionModel, RoleModel } from "../..";
import { AbortEvent } from "../../utils/abort";
import { CostModel, CostType } from "../rules/cost";
import { WeaponModel } from "./weapon";
import { SpellModel } from "./spell";

export type PlayEvent = {
    position?: number;
    spell?: Model[];
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
        readonly isCollectible: boolean;
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
        readonly features: FeaturesModel;

        readonly hero?: HeroModel;
        readonly minion?: MinionModel;
        readonly weapon?: WeaponModel;
        readonly spell?: SpellModel;
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
                features: new FeaturesModel({}),
                hooks: new CardHooksModel({}),
                anchor: new AnchorModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public check(): boolean {
        const game = this.route.game;
        const player = this.route.player;
        if (!player) return false;
        if (!game) return false;
        const turn = game.child.turn;
        if (turn.refer.current !== player) return false;
        const cost = this.child.cost;
        if (cost.state.type === CostType.MANA) {
            const mana = player.child.mana;
            if (mana.state.current < cost.state.current) return false;
            return true;
        }
        return true;
    }

    public async play() {
        if (!this.check()) return;
        const player = this.route.player;
        if (!player) return;
        // signal
        const signal = this.event.toPlay(new AbortEvent());
        if (signal.isAbort) return;
        // event
        const event = await this.toPlay();
        if (!event) return;
        await this.doPlay(event);
        await this.event.onPlay(event);
    }

    private async doPlay(event: PlayEvent) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const minion = this.child.minion;
        const spell = this.child.spell;
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.consume(cost.state.current);

        // reserve
        const board = player.child.board;
        if (minion) minion.doSummon(board, event.position);

        // battlecry
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(...params);
        }

        // summon
        if (minion) minion.onSummon();
        // spell
        if (spell && event.spell) await spell.run(...event.spell);
    }
    
    private async toPlay() {
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        const event: PlayEvent = {
            battlecry: new Map(),
        };
        // minion
        const minion = this.child.minion;
        if (minion) event.position = await minion.toSummon();

        // spell
        const spell = this.child.spell;
        if (spell) {
            const selectors = spell.toRun();
            // condition not match
            if (!selectors) return;
            // elusive
            for (const item of selectors) {
                item.options = item.options.filter(item => {
                    if (!(item instanceof RoleModel)) return true; 
                    const role: RoleModel = item;
                    const elusive = role.child.entries.child.elusive;
                    if (elusive.state.status) return false;
                    return true;
                });
                // invalid selector
                if (!item.options.length) return;
            }
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                // user cancel
                if (result === undefined) return;
                params.push(result);
            }
            event.spell = params;
        }

        for (const item of battlecry) {
            const selectors = item.toRun();
            // condition not match
            if (!selectors) continue;
            for (const item of selectors) {
                // invalid selector
                if (!item.options.length) return;
            }
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                // user cancel
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

    public async use() {}

    @DebugUtil.log()
    public async clear() {
        const minion = this.child.minion;
        minion?.clear();
        const hooks = this.child.hooks;
        const deathrattle = hooks.child.deathrattle;
        for (const item of deathrattle) await item.run();
    }
}