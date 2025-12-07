import { DebugService, Event, Model, TranxService } from "set-piece";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { DependencyModel } from "../../common/dependency";
import { MinionCardModel } from "../../entities/cards/minion";
import { AbortEvent } from "../../../types/events/abort";
import { Selector } from "../../../types/selector";
import { CardPerformModel } from "./card";
import { AppModel } from "../../app";

export type MinionHooksConfig = {
    battlecry: Map<BattlecryModel, Array<Model | undefined>>
}

export namespace MinionPerformModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event,
    }
    export type S = {
        from: number;
        to: number;
        index: number;
    }
    export type C = {
        battlecry: DependencyModel<BattlecryModel>[]
    }
    export type R = {}
}

export class MinionPerformModel extends CardPerformModel<
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
    
    protected get isReady(): boolean {
        if (!super.isReady) return false;
        const player = this.route.player;
        if (!player) return false;

        // board check
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
            child: { battlecry: [], ...props.child },
            refer: { ...props.refer },
        });
    }

    // play
    public async run(): Promise<void> {
        const card = this.route.minion;
        if (!card) return;

        if (!this.state.isPending) {
            if (!this.isReady) return;

            // prepare
            const params = await this.prepare();
            if (!params) return;

            // before
            const player = this.route.player;
            if (!player) return;
            const to = params[0];
            const config = params[1];
            const hand = player.child.hand;
            const from = hand.child.cards.indexOf(card);
            if (from === -1) return;

            let event = new AbortEvent({});
            this.event.toPlay(event);
            let isValid = event.detail.isValid;

            // execute
            this.consume();
            if (!isValid) {
                const hand = player.child.hand;
                hand.del(card);
                return;
            }
            const board = player.child.board;
            card.summon(board, to);

            this.init(from, to, config);
        }

        // execute
        while (true) {
            const index = this.origin.state.index;
            const task = this.origin.child.battlecry[index];
            if (!task) break;

            const hook = task.refer.key;
            const params = task.values;
            if (!hook) continue;
            if (!params) continue;

            this.origin.state.index += 1;
            await hook.run(params);
        }
        this.reset();

        // after
        DebugService.log(`${card.name} Played`);
        this.event.onPlay(new Event({}));
    }


    // lifecycle
    @TranxService.span()
    protected init(from: number, to: number, config: MinionHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.isPending = true;
        this.origin.state.to = to;
        this.origin.state.index = 0;
        config.battlecry.forEach((params, item) => {
            const map = DependencyModel.new(params, item);
            this.origin.child.battlecry?.push(map);
        })
    }

    @TranxService.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.from = 0;
        this.origin.state.to = 0;
        this.origin.state.index = 0;
        this.origin.child.battlecry = [];
    }

    // prepare
    protected async prepare(): Promise<[number, MinionHooksConfig] | undefined> {
        const player = this.route.player;
        if (!player) return;
        // position
        const board = player.child.board;
        const size = board.child.cards.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const selector = new Selector(options, { desc: `Deploy ${this.name} at certain position` });
        const to = await player.controller.get(selector);
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
                const selector = item.precheck(params);
                if (!selector) break;
                if (!selector.options.length) params.push(undefined);
                else {
                    const option = await player.controller.get(selector);
                    if (option === undefined) return;
                    else params.push(option);
                }
                if (!item.state.isMultiselect) break;
            }
            config.battlecry.set(item, params);
        }
        return [to, config];
    }


}