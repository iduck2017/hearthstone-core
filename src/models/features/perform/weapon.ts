import { DebugUtil, Event, Model, TranxUtil } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";
import { WeakMapModel } from "../../common/weak-map";
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
        params: WeakMapModel<BattlecryModel, Model>[]
    }
    export type R = {
    }
}

export class WeaponPerformModel extends PerformModel<
    WeaponPerformModel.E,
    WeaponPerformModel.S,
    WeaponPerformModel.C,
    WeaponPerformModel.R
> {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel)
        return {
            ...result,
            weapon,
        }
    }

    private resolve?: () => void;

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
    public async play(): Promise<void> {
        // doPlay
        const config = await this.prepare();
        if (!config) return;

        let aborted = !this.toPlay(config);
        if (aborted) return;

        this.doPlay()
        return new Promise((resolve) => {
            this.resolve = resolve;
        })
    }

    
    public toPlay(config: WeaponHooksConfig): boolean {
        // status
        if (!this.status) return false;

        const weapon = this.route.weapon;
        if (!weapon) return false;

        // from
        const player = this.route.player;
        if (!player) return false;
        const hand = player.child.hand;
        const from = hand.child.cards.indexOf(weapon);
        if (from === -1) return false;

        // toPlay
        let event = new AbortEvent({});
        this.event.toPlay(event);
        let aborted = event.detail.aborted;

        // consume
        this.consume()
        if (aborted) {
            hand.del(weapon);
            return false;
        }

        // summon
        const board = player.child.board;
        aborted = !this.toEquip(board);
        if (aborted) return false;
        this.doEquip(board);

        // doPLay
        this.init(from, config);

        // debug
        if (!weapon) return false;
        DebugUtil.log(`${weapon.name} Played`);
        return true;
    }

    public doPlay() {
        const index = this.origin.state.index;
        this.origin.state.index += 1;

        const pair = this.origin.child.params?.[index];
        if (!pair) {
            const weapon = this.route.weapon;
            if (!weapon) return;
            this.reset();
            this.onEquip()
        } else {
            const hook = pair.refer.key;
            const params = pair.values;
            if (!hook) return;
            if (!params) return;
            hook.run(...params);
        }
    }


    // equip
    public equip(board?: BoardModel, index?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        let aborted = !this.toEquip(board);
        if (aborted) return;
        this.doEquip(board);
        this.onEquip();
    }

    private toEquip(board: BoardModel): boolean {
        const event = new AbortEvent({});
        this.event.toEquip(event);
        if (event.detail.aborted) return false;
        return true;
    }

    private onEquip() {
        this.event.onEquip(new Event({}));
    }

    @TranxUtil.span()
    private doEquip(board: BoardModel) {
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


    
    // lifecycle
    @TranxUtil.span()
    protected init(from: number, config: WeaponHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.locked = true;
        this.origin.state.index = 0;
        config.battlecry.forEach((params, item) => {
            const map = WeakMapModel.generate(params, item);
            this.origin.child.params?.push(map);
        })
    }


    // use
    protected async prepare(): Promise<WeaponHooksConfig | undefined> {
        if (!this.status) return;

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