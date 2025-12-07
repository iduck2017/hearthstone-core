import { DebugService, Event, Model, TranxService } from "set-piece";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { DependencyModel } from "../../common/dependency";
import { AbortEvent } from "../../../utils/events/abort";
import { CardPerformModel } from "./card";
import { WeaponCardModel } from "../../entities/cards/weapon";

export type WeaponHooksConfig = {
    battlecry: Map<BattlecryModel, Model[]>
}

export namespace WeaponPerformModel {
    export type E = {}
    export type S = {
        from: number;
        to: number;
        index: number;
    }
    export type C = {
        dependencies: DependencyModel<BattlecryModel>[]
    }
    export type R = {
    }
}

export class WeaponPerformModel extends CardPerformModel<
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
            child: { dependencies: [], ...props.child },
            refer: { ...props.refer },
        });
    }

    // play
    public async run(): Promise<void> {
        const card = this.route.weapon;
        if (!card) return;

        if (!this.state.isPending) {
            if (!this.isReady) return;

            // prepare
            const config = await this.prepare();
            if (!config) return;

            // before
            const player = this.route.player;
            if (!player) return;
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
            };
            card.equip(player);
            this.init(from, config);
        }

        // execute
        while (true) {
            const index = this.origin.state.index;
            const task = this.origin.child.dependencies[index];
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


    @TranxService.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.from = 0;
        this.origin.state.to = 0;
        this.origin.state.index = 0;
        this.origin.child.dependencies = [];
    }

    // lifecycle
    @TranxService.span()
    protected init(from: number, config: WeaponHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.isPending = true;
        this.origin.state.index = 0;
        config.battlecry.forEach((params, item) => {
            const map = DependencyModel.new(params, item);
            this.origin.child.dependencies?.push(map);
        })
    }

    // use
    protected async prepare(): Promise<WeaponHooksConfig | undefined> {
        if (!this.isReady) return;

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
        return config;
    }


}