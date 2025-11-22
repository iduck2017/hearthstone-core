import { DebugUtil, Event, Model, Route, TranxUtil } from "set-piece";
import { EffectModel } from "../hooks/effect";
import { DependencyModel } from "../../common/dependency";
import { SkillModel } from "../../entities/skill";
import { PerformModel } from ".";
import { AbortEvent } from "../../../types/events/abort";
import { MinionCardModel } from "../../entities/cards/minion";
import { HeroModel, RoleModel } from "../../entities/heroes";

export type SkillHooksConfig = {
    effects: Map<EffectModel, Model[]>
}

export namespace SkillPerformModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    }
    export type S = {
        index: number;
    }
    export type C = {
        dependencies: DependencyModel<EffectModel>[]
    }
    export type R = {}
    export type P = {
        skill: SkillModel | undefined;
    }
}

export class SkillPerformModel extends PerformModel<
    SkillPerformModel.E,
    SkillPerformModel.S,
    SkillPerformModel.C,
    SkillPerformModel.R
> {
    public get route(): Route & SkillPerformModel.P & PerformModel.P {
        const result = super.route;
        const skill: SkillModel | undefined = result.items.find(item => item instanceof SkillModel)
        return {
            ...result,
            skill,
        }
    }

    public get isValid(): boolean {
        // turn check
        const game = this.route.game;
        if (!game) return false;
        const player = this.route.player;
        if (!player) return false;
        const turn = game.child.turn;
        const current = turn.refer.current;
        if (current !== player) return false;

        // skill check
        const skill = this.route.skill;
        if (!skill) return false;
        
        // cost check
        const cost = skill.child.cost;
        if (!cost.isValid) return false;

        // At least one valid effect
        const effects = skill.child.effects;
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

    constructor(props?: SkillPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
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
        const skill = this.route.skill;
        if (!skill) return;
        const mana = player.child.mana;
        const cost = skill.child.cost;
        if (!cost) return;
        mana.consume(cost.state.current, skill);
    }

    // play
    public async run(): Promise<void> {
        const card = this.route.skill;
        if (!card) return;

        if (!this.state.isPending) {
            if (!this.isValid) return;

            // prepare
            const config = await this.prepare();
            if (!config) return;

            // before
            let event = new AbortEvent({});
            this.event.toRun(event);
            let isValid = event.detail.isValid;

            // execute
            this.consume();
            if (!isValid) return;
            this.init(config);
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
            console.log(hook.name, params);

            this.origin.state.index += 1;
            await hook.run(params);
        }
        this.reset();

        // after
        DebugUtil.log(`${card.name} Used`);
        this.event.onRun(new Event({}));
    }


    // lifecycle
    @TranxUtil.span()
    protected init(config: SkillHooksConfig) {
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
        this.origin.state.index = 0;
        this.origin.child.dependencies = [];
    }

    // prepare
    protected async prepare(): Promise<SkillHooksConfig | undefined> {
        if (!this.isValid) return;

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

