import { DebugUtil, Event, Method, Model } from "set-piece";
import { Selector } from "../../../types/selector";
import { PlayerModel } from "../../entities/player";
import { GameModel } from "../../entities/game";
import { CostModel } from "../../features/rules/cost";
import { HeroModel, RoleModel } from "../heroes";
import { DamageModel } from "../../features/rules/damage";
import { AbortEvent } from "../../../types/events/abort";
import { EffectModel } from "../../features/hooks/effect";
import { SpellHooksConfig } from "../../features/perform/spell";
import { MinionCardModel } from "../cards/minion";
import { WeakMapModel } from "../../common/weak-map";

export type SkillHooksConfig = {
    effects: Map<EffectModel, Array<Model | undefined>>
}

export namespace SkillModel {
    export type E = {
        toRun: Event,
        onRun: Event
    };
    export type S = {
        desc: string,
        name: string;
        multiSelect: boolean;
        async: boolean;
    };
    export type C = {
        cost: CostModel,
        effects: EffectModel[];
        params: WeakMapModel<EffectModel, Model>[]
    };
    export type R = {};
}

export abstract class SkillModel<
    T extends Model = Model,
    E extends Partial<SkillModel.E> & Model.E = {},
    S extends Partial<SkillModel.S> & Model.S = {},
    C extends Partial<SkillModel.C> & Model.C = {},
    R extends Partial<SkillModel.R> & Model.R = {},
> extends Model<
    E & SkillModel.E,
    S & SkillModel.S,
    C & SkillModel.C,
    R & SkillModel.R
> {
    public get name() {
        return this.state.name;
    }

    public get chunk() {
        return {
            desc: this.state.desc,
            name: this.state.name,
            cost: this.child.cost.chunk,
        }
    }

    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
            hero: result.items.find(item => item instanceof HeroModel),
        }
    }

    public get status() {
        const cost = this.child.cost;
        if (!cost.status) return false;

        // time

        // At least one valid effect
        const effects = this.child.effects;
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

    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<SkillModel.S, 'name' | 'desc'>;
        child: C & Pick<SkillModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                multiSelect: false, 
                async: false,
                ...props.state,
            },
            child: {
                damage: props.child?.damage ?? new DamageModel(),
                effects: props.child?.effects ?? [],
                params: props.child?.params ?? [],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }

    public async use() {
        // precheck
        const player = this.route.player;
        if (!player) return;
        const cost = this.child.cost;
        if (!cost?.status) return;

        // prepare
        const params: Array<any> = [];
        while (true) {
            const options = this.prepare(...params);
            if (!options) break;
            if (options.options.length === 0) params.push(undefined);
            else {
                const result = await player.child.controller.get(options);
                if (result === undefined) return;
                params.push(result);
            }
            if (!this.state.multiSelect) break;
        }

        // toRun
        if (!this.toRun()) return;
        this.doRun(...params);
        if (this.state.async) return;
        this.onRun();
    }

    protected toRun(): boolean | undefined {
        // abort
        const event = new AbortEvent({});
        this.event.toRun?.(event);
        if (event.detail.aborted) return;
        
        // execute
        const player = this.route.player;
        if (!player) return;
        const cost = this.child.cost;
        const mana = player.child.mana;
        mana.consume(cost.state.current, this);
        
        const desc = this.state.desc;
        DebugUtil.log(`${this.name} use: ${desc}`);
        return true;
    }

    public doUse() {
        
    }

    protected onRun() {
        this.event.onRun(new Event({}));
    }


    // prepare
    protected async prepare(): Promise<SkillHooksConfig | undefined> {
        if (!this.status) return;

        const player = this.route.player;
        if (!player) return;

        // hooks
        const config: SkillHooksConfig = {
            effects: new Map(),
        }
        const effects = this.child.effects;
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

}