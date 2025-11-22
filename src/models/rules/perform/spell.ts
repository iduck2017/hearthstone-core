import { DebugUtil, Event, Model, Route, TranxUtil } from "set-piece"
import { SpellEffectModel } from "../hooks/spell-effect"
import { DependencyModel } from "../../common/dependency"
import { SpellCardModel } from "../../entities/cards/spell"
import { PerformModel } from "."
import { SpellCastEvent } from "../../../types/events/spell-cast"
import { MinionCardModel } from "../../entities/cards/minion"
import { HeroModel, RoleModel } from "../../entities/heroes"
import { AbortEvent } from "../../../types/events/abort"

export type SpellHooksConfig = {
    effects: Map<SpellEffectModel, Model[]>
}

export namespace SpellPerformModel {
    export type E = {}
    export type S = {
        from: number;
        index: number;
    }
    export type C = {
        dependencies: DependencyModel<SpellEffectModel>[]
    }
    export type R = {}
    export type P = {
        spell: SpellCardModel | undefined;
    }
}


export class SpellPerformModel extends PerformModel<
    SpellPerformModel.E,
    SpellPerformModel.S,
    SpellPerformModel.C,
    SpellPerformModel.R
> {
    public get route(): Route & SpellPerformModel.P & PerformModel.P {
        const result = super.route;
        const spell: SpellCardModel | undefined = result.items.find(item => item instanceof SpellCardModel)
        return {
            ...result,
            spell,
        }
    }

    public get status(): boolean {
        if (!super.status) return false;
        const spell = this.route.spell;
        if (!spell) return false;

        // At least one valid effect
        const effects = spell.child.effects;
        for (const item of effects) {
            // At least one valid target (If need)
            while (true) {
                const selector = item.prepare([]);
                if (!selector) break;
                if (!selector.options.length) return false;
                if (!item.state.isMultiselect) break;
            }
        }
        return true;
    }

    constructor(props?: SpellPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                from: 0,
                index: 0,
                ...props.state 
            },
            child: { dependencies: [], ...props.child },
            refer: { ...props.refer },
        });
    }

    
    public consume() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const mana = player.child.mana;
        const cost = card.child.cost;
        if (!cost) return;
        mana.consume(cost.state.current, card);
    }

    // play
    public async run(): Promise<void> {
        const card = this.route.spell;
        if (!card) return;

        if (!this.state.isPending) {
            if (!this.status) return;

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
            this.event.toRun(event);
            let isValid = event.detail.isValid;

            // execute
            this.consume();
            if (!isValid) {
                const hand = player.child.hand;
                hand.del(card);
                return;
            };

            card.deploy();
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
        DebugUtil.log(`${card.name} Played`);
        this.event.onRun(new Event({}));
    }

    // lifecycle
    @TranxUtil.span()
    protected init(from: number, config: SpellHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.isPending = true;
        this.origin.state.index = 0;
        config.effects.forEach((params, item) => {
            const map = DependencyModel.new(params, item);
            this.origin.child.dependencies?.push(map);
        })
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.from = 0;
        this.origin.state.index = 0;
        this.origin.child.dependencies = [];
    }


    // prepare
    protected async prepare(): Promise<SpellHooksConfig | undefined> {
        if (!this.status) return;

        const player = this.route.player;
        if (!player) return;
        const spell = this.route.spell;
        if (!spell) return;

        // hooks
        const config: SpellHooksConfig = {
            effects: new Map(),
        }
        const effects = spell.child.effects;
        for (const item of effects) {
            const params: any[] = []
            while (true) {
                const selector = item.prepare(params);
                if (!selector) break;

                // exclude elusive
                selector.exclude((item) => {
                    if (item instanceof MinionCardModel || item instanceof HeroModel) {
                        const _item: RoleModel = item;
                        const elusive = _item.child.elusive;
                        if (elusive.state.isActived) return false;
                    }
                    return true;
                })
                    
                if (!selector.options.length) params.push(undefined);
                else {
                    const option = await player.controller.get(selector);
                    if (option === undefined) return;
                    else params.push(option);
                }
                if (!item.state.isMultiselect) break;
            }
            config.effects.set(item, params);
        }
        return config;
    }

}