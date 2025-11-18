import { DebugUtil, Event, Model, Route, TranxUtil } from "set-piece"
import { SpellEffectModel } from "../hooks/spell-effect"
import { WeakMapModel } from "../../common/weak-map"
import { CallerModel } from "../../common/caller"
import { SpellCardModel } from "../../entities/cards/spell"
import { PerformModel } from "."
import { AbortEvent } from "../../../types/events/abort"
import { SpellCastEvent } from "../../../types/events/spell-cast"
import { MinionCardModel } from "../../entities/cards/minion"
import { HeroModel, RoleModel } from "../../entities/heroes"

export type SpellHooksConfig = {
    effects: Map<SpellEffectModel, Model[]>
}

export namespace SpellPerformModel {
    export type E = {
        toCast: SpellCastEvent
    }
    export type S = {
        from: number;
        index: number;
    }
    export type C = {
        params: WeakMapModel<SpellEffectModel, Model[]>[]
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
> implements CallerModel<[SpellEffectModel]> {
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
        const effects = spell.child.effects;
        // At least one valid effect
        for (const item of effects) {
            // At least one valid target (If need)
            while (true) {
                const selector = item.prepare([]);
                if (!selector) break;
                if (!selector.options.length) return false;
                if (!item.state.multiselect) break;
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
        
        const player = this.route.player;
        if (!player) return;
        const spell = this.route.spell;
        if (!spell) return;
        this.expand()

        // use
        const hand = player.child.hand;
        const from = hand.child.cards.indexOf(spell);
        
        // run
        DebugUtil.log(`${spell.name} Played`);
        this.start(from, config);
    }


    public get config(): SpellHooksConfig {
        const result = new Map<SpellEffectModel, Model[]>();
        this.origin.child.params?.forEach(item => {
            if (!item.refer.key) return;
            if (!item.refer.value) return;
            result.set(item.refer.key, item.refer.value);
        })
        return { effects: result };
    }

    public start(from: number, config: SpellHooksConfig) {
        const player = this.route.player;
        const spell = this.route.spell;
        if (!player) return;
        if (!spell) return;
        
        // precheck
        const eventB = new AbortEvent({});
        this.event.toRun(eventB);
        if (eventB.detail.aborted) {
            const hand = player.child.hand;
            hand.del(spell);
            return;
        }

        const eventA = new SpellCastEvent({ config });
        this.event.toCast(eventA);
        if (eventA.detail.aborted) {
            const hand = player.child.hand;
            hand.del(spell);
            return;
        }
        
        this.cast();

        // hooks
        this._start(from, config);
        this.next()
    }
    @TranxUtil.span()
    protected _start(from: number, config: SpellHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.locked = true;
        this.origin.state.index = 0;
        config.effects.forEach((params, item) => {
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
        const index = this.origin.state.index;
        this.origin.state.index += 1;
        const pair = this.origin.child.params?.[index];
        if (!pair) {
            const spell = this.route.spell;
            if (!spell) return;
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

    private end(from: number, config: SpellHooksConfig) {
        const player = this.route.player;
        if (!player) return;
        // end
        this.event.onRun(new Event({}));
        this.event.onPlay(new Event({}));
    }


    @TranxUtil.span()
    protected reset() {
        this.origin.state.locked = false;
        this.origin.state.from = 0;
        this.origin.state.index = 0;
        this.origin.child.params = [];
    }

    // use
    protected async prepare(): Promise<SpellHooksConfig | undefined> {
        const player = this.route.player;
        if (!player) return;
        // hooks
        const spell = this.route.spell;
        if (!spell) return;
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
                        if (elusive.state.actived) return false;
                    }
                    return true;
                })
                    
                if (!selector.options.length) params.push(undefined);
                else {
                    const option = await player.child.controller.get(selector);
                    if (option === undefined) return;
                    else params.push(option);
                }
                if (!item.state.multiselect) break;
            }
            config.effects.set(item, params);
        }
        return config;
    }


    public cast() {
        const player = this.route.player;
        if (!player) return;
        const spell = this.route.spell;
        if (!spell) return;
        const hand = player.child.hand;
        hand.del(spell);
        const graveyard = player.child.graveyard;
        graveyard.add(spell);
    }


}