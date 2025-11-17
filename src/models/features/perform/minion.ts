import { DebugUtil, Event, Model, TranxUtil } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";
import { WeakMapModel } from "../../common/weak-map";
import { MinionCardModel } from "../../entities/cards/minion";
import { CallerModel } from "../../common/caller";
import { AbortEvent } from "../../../types/events/abort";
import { BoardModel } from "../../entities/board";
import { Selector } from "../../../types/selector";
import { PerformModel } from ".";
import { AppModel } from "../../app";

export type MinionHooksConfig = {
    battlecry: Map<BattlecryModel, Model[]>
}

export namespace MinionPerformModel {
    export type E = {
        toSummon: AbortEvent;
        onSummon: Event;
    }
    export type S = {
        from: number;
        to: number;
        index: number;
    }
    export type C = {
        params: WeakMapModel<BattlecryModel, Model[]>[]
    }
    export type R = {
    }
}

export class MinionPerformModel extends PerformModel<
    MinionPerformModel.E,
    MinionPerformModel.S,
    MinionPerformModel.C,
    MinionPerformModel.R
> implements CallerModel<[BattlecryModel]> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel)
        return {
            ...result,
            minion,
        }
    }

    public get status(): boolean {
        if (!super.status) return false;
        const player = this.route.player;
        if (!player) return false;
        // board size
        const board = player.child.board;
        if (!board) return false;
        if (board.child.cards.length >= 7) return false;
        return true;
    }

    constructor(props?: MinionPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                from: 0,
                to: 0,
                index: 0,
                ...props.state 
            },
            child: { params: [], ...props.child },
            refer: { ...props.refer },
        });
    }

    // play
    public async play() {
        // Common checks
        if (!this.status) return;
        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;

        const params = await this.prepare();
        // cancel by user
        if (!params) return;

        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.aborted) return;

        this.expand()
        // use
        const hand = player.child.hand;
        const from = hand.child.cards.indexOf(minion);
        DebugUtil.log(`${minion.name} Played`);
        this.start(from, ...params);
    }

    public get config(): MinionHooksConfig {
        const result = new Map<BattlecryModel, Model[]>();
        this.origin.child.params?.forEach(item => {
            if (!item.refer.key) return;
            if (!item.refer.value) return;
            result.set(item.refer.key, item.refer.value);
        })
        return {
            battlecry: result,
        };
    }

    public start(from: number, to: number, config: MinionHooksConfig) {
        const player = this.route.player;
        const minion = this.route.minion;
        if (!player) return;
        if (!minion) return;

        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.aborted) {
            const hand = player.child.hand;
            hand.del(minion);
            return;
        }

        // deploy
        const board = player.child.board;
        if (!board) return;
        this._summon(board, to);
        // hooks
        this._start(from, to, config);
        this.next()
    }
    @TranxUtil.span()
    protected _start(from: number, to: number, config: MinionHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.locked = true;
        this.origin.state.to = to;
        this.origin.state.index = 0;
        config.battlecry.forEach((params, item) => {
            this.origin.child.params?.push(
                new WeakMapModel({
                    refer: {
                        key: item,
                        value: params,
                    }
                })
            )
        })
    }

    public next() {
        const from = this.origin.state.from;
        const to = this.origin.state.to;
        const index = this.origin.state.index;
        this.origin.state.index += 1;
        const pair = this.origin.child.params?.[index];
        if (!pair) {
            const minion = this.route.minion;
            if (!minion) return;
            this.reset();
            this.end(from, to, this.config)
        } else {
            const key = pair.refer.key;
            const value = pair.refer.value;
            if (!key) return;
            if (!value) return;
            key.promise(this);
            key.start(...value);
        }
    }

    private end(from: number, to: number, config: MinionHooksConfig) {
        const player = this.route.player;
        if (!player) return;
        // end
        this.event.onSummon(new Event({}));
        this.event.onRun(new Event({}));
        this.event.onPlay(new Event({}));
    }

    public summon(board?: BoardModel, position?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this._summon(board, position);
        this.event.onSummon(new Event({}));
    }
    @TranxUtil.span()
    private _summon(board: BoardModel, position?: number) {
        const minion = this.route.minion;
        if (!minion) return;
        DebugUtil.log(`${minion.name} Summoned`);
        const player = this.route.player;

        // summon from hand
        const hand = player?.child.hand;
        if (hand) hand.del(minion);
        
        // summon from template
        const app = this.route.app;
        if (app) app.unlink(minion);
        
        // add to board
        board.add(minion, position);
    }


    @TranxUtil.span()
    protected reset() {
        this.origin.state.locked = false;
        this.origin.state.from = 0;
        this.origin.state.to = 0;
        this.origin.state.index = 0;
        this.origin.child.params = [];
    }

    // use
    protected async prepare(): Promise<[number, MinionHooksConfig] | undefined> {
        const player = this.route.player;
        if (!player) return;
        // position
        const board = player.child.board;
        const size = board.child.cards.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const selector = new Selector(options, { desc: `Deploy ${this.name} at certain position` });
        const to = await player.child.controller.get(selector);
        if (to === undefined) return;

        // hooks
        const minion = this.route.minion;
        if (!minion) return;
        const config: MinionHooksConfig = {
            battlecry: new Map(),
        }
        const battlecry = minion.child.battlecry;
        for (const item of battlecry) {
            const params: any[] = []
            while (true) {
                const selector = item.prepare(...params);
                if (!selector) break;
                if (!selector.options.length) params.push(undefined);
                else {
                    const option = await player.child.controller.get(selector);
                    if (option === undefined) return;
                    else params.push(option);
                }
                if (!item.state.multiselect) break;
            }
            config.battlecry.set(item, params);
        }
        return [to, config];
    }


}