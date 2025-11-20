import { DebugUtil, Event, Model, TranxUtil } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";
import { WeakMapModel } from "../../common/weak-map";
import { MinionCardModel } from "../../entities/cards/minion";
import { AbortEvent } from "../../../types/events/abort";
import { BoardModel } from "../../entities/board";
import { Selector } from "../../../types/selector";
import { PerformModel } from ".";
import { AppModel } from "../../app";

export type MinionHooksConfig = {
    battlecry: Map<BattlecryModel, Array<Model | undefined>>
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
        params: WeakMapModel<BattlecryModel, Model>[]
    }
    export type R = {
    }
}

export class MinionPerformModel extends PerformModel<
    MinionPerformModel.E,
    MinionPerformModel.S,
    MinionPerformModel.C,
    MinionPerformModel.R
> {
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

    private resolve?: () => void;

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
    public async play(): Promise<void> {
        // prepare
        const params = await this.prepare();
        if (!params) return;

        // toPlay
        let aborted = !this.toPlay(...params);
        if (aborted) return;
        
        // doPlay
        this.doPlay()
        return new Promise((resolve) => {
            this.resolve = resolve;
        })
    }

    public toPlay(to: number, config: MinionHooksConfig): boolean {
        // status
        if (!this.status) return false;

        const minion = this.route.minion;
        if (!minion) return false;

        // from
        const player = this.route.player;
        if (!player) return false;
        const hand = player.child.hand;
        const from = hand.child.cards.indexOf(minion);
        if (from === -1) return false;

        // toPlay
        let event = new AbortEvent({});
        this.event.toPlay(event);
        let aborted = event.detail.aborted;

        // consume
        this.consume()
        if (aborted) {
            hand.del(minion);
            return false;
        }

        // summon
        const board = player.child.board;
        aborted = this.toSummon(board, to);
        this.doSummon(board, to);
        if (aborted) return false;

        // doPLay
        this.init(from, to, config);

        // debug
        if (!minion) return false;
        DebugUtil.log(`${minion.name} Played`);
        return true;
    }

    public doPlay() {
        const index = this.origin.state.index;
        this.origin.state.index += 1;

        const pair = this.origin.child.params?.[index];
        if (!pair) {
            const minion = this.route.minion;
            if (!minion) return;
            this.reset();
            this.onPlay()
        } else {
            const hook = pair.refer.key;
            const params = pair.values;
            if (!hook) return;
            if (!params) return;
            hook.run(...params);
        }
    }

    private onPlay() {
        // resolve
        this.resolve?.();
        this.resolve = undefined;

        // event
        this.onSummon();
        this.event.onPlay(new Event({}));
    }


    // summon
    public summon(board?: BoardModel, to?: number) {
        // params
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;

        // summon
        const aborted = !this.toSummon(board, to);
        if (aborted) return;
        this.doSummon(board, to);
        this.event.onSummon(new Event({}));
    }

    private toSummon(board: BoardModel, to?: number): boolean {
        const event = new AbortEvent({});
        this.event.toSummon(event);
        const aborted = event.detail.aborted;
        if (aborted) return false;
        return true;
    }

    @TranxUtil.span()
    private doSummon(board: BoardModel, to?: number) {
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
        board.add(minion, to);
    }

    private onSummon() {
        this.event.onSummon(new Event({}));
    }


    // lifecycle
    @TranxUtil.span()
    protected init(from: number, to: number, config: MinionHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.locked = true;
        this.origin.state.to = to;
        this.origin.state.index = 0;
        config.battlecry.forEach((params, item) => {
            const map = WeakMapModel.generate(params, item);
            this.origin.child.params?.push(map);
        })
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.locked = false;
        this.origin.state.from = 0;
        this.origin.state.to = 0;
        this.origin.state.index = 0;
        this.origin.child.params = [];
    }



    // prepare
    protected async prepare(): Promise<[number, MinionHooksConfig] | undefined> {
        if (!this.status) return;

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
            const params: Array<Model | undefined> = []
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