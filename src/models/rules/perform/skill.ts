import { DebugUtil, Event, Model, Route, TranxUtil } from "set-piece";
import { EffectModel } from "../../features/hooks/effect";
import { DependencyModel } from "../../common/dependency";
import { SkillModel } from "../../entities/skill";
import { CardPerformModel } from "./card";
import { AbortEvent } from "../../../types/events/abort";
import { MinionCardModel } from "../../entities/cards/minion";
import { HeroModel, RoleModel } from "../../entities/heroes";
import { PlayerModel } from "../../entities/player";
import { GameModel } from "../../entities/game";

export type SkillHooksConfig = {
    effects: Map<EffectModel, Model[]>
}

export namespace SkillPerformModel {
    export type E = {
        toUse: AbortEvent;
        onUse: Event;
    }
    export type S = {
        isPending: boolean;
        index: number;
    }
    export type C = {
        effects: DependencyModel<EffectModel>[]
    }
    export type R = {}
    export type P = {
        skill: SkillModel | undefined;
        hero: HeroModel | undefined;
        game: GameModel | undefined;
        player: PlayerModel | undefined;
    }
}

export class SkillPerformModel extends Model<
    SkillPerformModel.E,
    SkillPerformModel.S,
    SkillPerformModel.C,
    SkillPerformModel.R
> {
    public get route(): Route & SkillPerformModel.P {
        const result = super.route;
        const skill: SkillModel | undefined = result.items.find(item => item instanceof SkillModel)
        return {
            ...result,
            skill,
            hero: result.items.find(item => item instanceof HeroModel),
            game: result.items.find(item => item instanceof GameModel),
            player: result.items.find(item => item instanceof PlayerModel),
        }
    }


    public get state() {
        const state = super.state;
        return {
            ...state,
            isReady: this.isReady,
        }
    }

    protected get isReady(): boolean {
        const player = this.route.player;
        if (!player) return false;
        if (!player.state.isCurrent) return false;

        const skill = this.route.skill;
        if (!skill) return false;
        const cost = skill.child.cost;
        if (!cost.state.isEnough) return false;
        
        // At least one valid effect
        const effects = skill.child.effects;
        for (const item of effects) {
            // At least one valid target (If need)
            while (true) {
                const selector = item.precheck([]);
                if (!selector) break;
                if (!selector.options.length) return false;
                if (!item.state.isMultiselect) break;
            }
        }

        return true;
    }


    constructor(props?: SkillPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                index: 0,
                isPending: false,
                ...props.state 
            },
            child: { effects: [], ...props.child },
            refer: { ...props.refer },
        });
    }

    
    public consume() {
        const player = this.route.player;
        if (!player) return;
        const skill = this.route.skill;
        if (!skill) return;
        const mana = player.child.mana;
        const cost = skill.child.cost;
        if (!cost) return;
        mana.consume(cost.state.current, skill);
    }

    // play
    public async run(): Promise<void> {
        const skill = this.route.skill;
        if (!skill) return;

        if (!this.state.isPending) {
            if (!this.isReady) return;

            // prepare
            const config = await this.prepare();
            if (!config) return;

            // before
            let event = new AbortEvent({});
            this.event.toUse(event);
            let isValid = event.detail.isValid;

            // execute
            this.consume();
            if (!isValid) return;
            this.init(config);
        }

        // execute
        while (true) {
            const index = this.origin.state.index;
            const task = this.origin.child.effects[index];
            if (!task) break;

            const hook = task.refer.key;
            const params = task.values;
            if (!hook) continue;
            if (!params) continue;
            console.log(hook.name, params);

            this.origin.state.index += 1;
            await hook.run(params);
        }
        this.reset();

        // after
        DebugUtil.log(`${skill.name} Used`);
        this.event.onUse(new Event({}));
    }


    // lifecycle
    @TranxUtil.span()
    protected init(config: SkillHooksConfig) {
        this.origin.state.isPending = true;
        this.origin.state.index = 0;
        config.effects.forEach((params, item) => {
            const map = DependencyModel.new(params, item);
            this.origin.child.effects?.push(map);
        })
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.index = 0;
        this.origin.child.effects = [];
    }

    // prepare
    protected async prepare(): Promise<SkillHooksConfig | undefined> {
        if (!this.isReady) return;

        const player = this.route.player;
        if (!player) return;
        const skill = this.route.skill;
        if (!skill) return;


        // hooks
        const config: SkillHooksConfig = {
            effects: new Map(),
        }
        const effects = skill.child.effects;
        for (const item of effects) {
            const params: any[] = []
            while (true) {
                const selector = item.precheck(params);
                if (!selector) break;

                // exclude elusive
                selector.exclude((item) => {
                    if (item instanceof MinionCardModel || item instanceof HeroModel) {
                        const _item: RoleModel = item;
                        const elusive = _item.child.elusive;
                        if (elusive.state.isEnabled) return false;
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

