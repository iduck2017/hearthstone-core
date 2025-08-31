import { DebugUtil, Model, TranxUtil, Props, Event, Format } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";
import { BoardModel } from "../containers/board";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { MinionHooksModel } from "../hooks/minion-hooks";
import { CardModel, CardProps } from ".";
import { RaceType } from "../../types/card";
import { FeaturesModel } from "../features/features";
import { RoleModel } from "../role";

export type MinionPlayEvent = {
    position: number;
    battlecry: Map<BattlecryModel, Model[]>;
}

export namespace MinionProps {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        onPlay: Event;
        onSummon: Event;
    };
    export type C = {
        readonly hooks: MinionHooksModel;
        readonly features: FeaturesModel;
        readonly role: RoleModel;
    };
    export type R = {};
}

export abstract class MinionModel<
    E extends Partial<MinionProps.E & CardProps.E> & Props.E = {},
    S extends Partial<MinionProps.S & CardProps.S> & Props.S = {},
    C extends Partial<MinionProps.C & CardProps.C> & Props.C = {},
    R extends Partial<MinionProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & MinionProps.E, 
    S & MinionProps.S, 
    C & MinionProps.C,
    R & MinionProps.R
> {
    constructor(props: MinionModel['props'] & {
        uuid: string | undefined;
        state: S & Format.State<MinionProps.S & CardProps.S>;
        child: C & Pick<MinionProps.C, 'role'> & Pick<CardProps.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                hooks: new MinionHooksModel({}),
                features: new FeaturesModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public async play() {
        if (!this.check()) return;
        const player = this.route.player;
        if (!player) return;
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        const event = await this.toPlay();
        if (!event) return;
        await this.doPlay(event);
        await this.event.onPlay(new Event({}));
    }

    private async doPlay(event: MinionPlayEvent) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.consume(cost.state.current);
        // reserve
        const board = player.child.board;
        this.doSummon(board, event.position);
        // battlecry
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        this.event.onSummon(new Event({}));
    }
    
    private async toPlay() {
        const hooks = this.child.hooks;
        const battlecry = hooks.child.battlecry;
        // summon
        const position = await this.toSummon();
        if (position === undefined) return;
        const event: MinionPlayEvent = {
            position,
            battlecry: new Map(),
        };
        // battlecry
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

    
    public summon(board: BoardModel, position?: number) {
        this.doSummon(board, position);
        this.event.onSummon(new Event({}));
    }

    private async toSummon(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.minions.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options));
        return position;
    }

    @TranxUtil.span()
    private doSummon(board: BoardModel, position?: number) {
        const right = board.child.minions.length;
        if (position === undefined) position = right;
        if (position === -1) position = right;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(this);
        board.add(this, position); 
    }


    @DebugUtil.log()
    public async dispose() {
        this.doRemove();
        const hooks = this.child.hooks;
        const deathrattle = hooks.child.deathrattle;
        for (const item of deathrattle) await item.run();
    }

    @TranxUtil.span()
    public doRemove() {
        const player = this.route.player;
        if (!player) return;
        player.child.board.del(this);
        player.child.graveyard.add(this);
    }

}