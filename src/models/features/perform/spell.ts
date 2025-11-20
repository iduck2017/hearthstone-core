import { DebugUtil, Event, Model, Route, TranxUtil } from "set-piece"
import { SpellEffectModel } from "../hooks/spell-effect"
import { WeakMapModel } from "../../common/weak-map"
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
        onCast: Event
    }
    export type S = {
        from: number;
        index: number;
    }
    export type C = {
        params: WeakMapModel<SpellEffectModel, Model>[]
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
                const selector = item.prepare();
                if (!selector) break;
                if (!selector.options.length) return false;
                if (!item.state.multiselect) break;
            }
        }
        return true;
    }

    private resolve?: () => void;

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

    public toPlay(config: SpellHooksConfig): boolean {
        // status
        if (!this.status) return false;
        const spell = this.route.spell;
        if (!spell) return false;
 
        // from
        const player = this.route.player;
        if (!player) return false;
        const hand = player.child.hand;
        const from = hand.child.cards.indexOf(spell);
        if (from === -1) return false;
 
        // toPlay
        const event = new AbortEvent({});
        this.event.toPlay(event);
        let aborted = event.detail.aborted;

        // toCast
        const eventB = new SpellCastEvent({ config });
        this.event.toCast(eventB);
        aborted = event.detail.aborted;

        // consume
        this.consume()
        if (aborted) {
            // counter
            hand.del(spell);
            return false;
        }

        // summon
        this.use();
        // doPLay
        this.init(from, config);

        // debug
        if (!spell) return false;
        DebugUtil.log(`${spell.name} Played`);
        return true;
    }

    public doPlay() {
        const from = this.origin.state.from;
        const index = this.origin.state.index;
        this.origin.state.index += 1;
        const pair = this.origin.child.params?.[index];
        if (!pair) {
            const spell = this.route.spell;
            if (!spell) return;
            this.reset();
            this.onPlay()
        } else {
            const effect = pair.refer.key;
            const params = pair.values;
            if (!effect) return;
            if (!params) return;
            effect.run(...params);
        }
    }

    private onPlay() {;
        // resolve
        this.resolve?.();
        this.resolve = undefined;
        // event
        this.event.onPlay(new Event({}));
    }

    // lifecycle
    @TranxUtil.span()
    protected init(from: number, config: SpellHooksConfig) {
        this.origin.state.from = from;
        this.origin.state.locked = true;
        this.origin.state.index = 0;
        config.effects.forEach((params, item) => {
            const map = WeakMapModel.generate(params, item);
            this.origin.child.params?.push(map);
        })
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.locked = false;
        this.origin.state.from = 0;
        this.origin.state.index = 0;
        this.origin.child.params = [];
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
                const selector = item.prepare(...params);
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




    @TranxUtil.span()
    protected use() {
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