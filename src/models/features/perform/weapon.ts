import { DebugUtil, Event, Model, TranxUtil } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";
import { WeakMapModel } from "../../common/weak-map";
import { CallerModel } from "../../common/caller";
import { AbortEvent } from "../../../types/events/abort";
import { BoardModel } from "../../entities/board";
import { PerformModel } from ".";
import { WeaponCardModel } from "../../entities/cards/weapon";

export type WeaponHooksConfig = {
    battlecry: Map<BattlecryModel, Model[]>
}

export namespace WeaponPerformModel {
    export type E = {
        toEquip: AbortEvent;
        onEquip: Event;
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

export class WeaponPerformModel extends PerformModel<
    WeaponPerformModel.E,
    WeaponPerformModel.S,
    WeaponPerformModel.C,
    WeaponPerformModel.R
> implements CallerModel<[BattlecryModel]> {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel)
        return {
            ...result,
            weapon,
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

    constructor(props?: WeaponPerformModel['props']) {
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
        if (!this.status) return;
        const config = await this.prepare();
        // cancel by user
        if (!config) return;
        this._play(config);
    }
    protected _play(config: WeaponHooksConfig) {
        const player = this.route.player;
        if (!player) return;
        const weapon = this.route.weapon;
        if (!weapon) return;
        this.expand()
        // use
        const hand = player.child.hand;
        const from = hand.child.cards.indexOf(weapon);
        // run
        DebugUtil.log(`${weapon.name} Played`);
        this.start(from, config);
    }

    public get config(): WeaponHooksConfig {
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

    public start(from: number, config: WeaponHooksConfig) {
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.aborted) return;
        const player = this.route.player;
        const weapon = this.route.weapon;
        if (!player) return;
        if (!weapon) return;
        // deploy
        const board = player.child.board;
        if (!board) return;
        this._deploy(board);
        // hooks
        this._start(from, config);
        this.next()
    }
    @TranxUtil.span()
    protected _start(from: number, config: WeaponHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.locked = true;
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
            const weapon = this.route.weapon;
            if (!weapon) return;
            this.reset();
            this.end(from, this.config)
        } else {
            const key = pair.refer.key;
            const value = pair.refer.value;
            if (!key) return;
            if (!value) return;
            key.promise(this);
            key.start(...value);
        }
    }

    private end(from: number, config: WeaponHooksConfig) {
        const player = this.route.player;
        if (!player) return;
        // end
        this.event.onEquip(new Event({}));
        this.event.onRun(new Event({}));
        this.event.onPlay(new Event({}));
    }

    public deploy(board?: BoardModel, index?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this._deploy(board, index);
        this.event.onEquip(new Event({}));
    }
    @TranxUtil.span()
    private _deploy(board: BoardModel, index?: number) {
        const weapon = this.route.weapon;
        if (!weapon) return;
        DebugUtil.log(`${weapon.name} Deployed`);
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        if (hand) hand.del(weapon);
        const hero = player.child.hero;
        hero.equip(weapon);
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
    protected async prepare(): Promise<WeaponHooksConfig | undefined> {
        const player = this.route.player;
        if (!player) return;
        // position
        const board = player.child.board;
        // hooks
        const weapon = this.route.weapon;
        if (!weapon) return;
        const config: WeaponHooksConfig = {
            battlecry: new Map(),
        }
        const battlecry = weapon.child.battlecry;
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
        return config;
    }


}