import { DebugUtil, Event, Method, Model } from "set-piece";
import { Selector } from "../../../types/selector";
import { PlayerModel } from "../../entities/player";
import { GameModel } from "../../entities/game";
import { CostModel } from "../../features/rules/cost";
import { HeroModel } from "../heroes";
import { DamageModel } from "../../features/rules/damage";
import { AbortEvent } from "../../../types/events/abort";

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
        const selector = this.prepare();
        if (!selector) return true;
        if (!selector.options.length) return false;
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
                ...props.child
            },
            refer: { ...props.refer }
        });
    }

    public async start() {
        // prepare
        const player = this.route.player;
        if (!player) return;
        const cost = this.child.cost;
        if (!cost?.status) return;
        
        const event = new AbortEvent({});
        this.event.toRun?.(event);
        if (event.detail.aborted) return;

        const params: any[] = [];
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
        
        // execute
        const mana = player.child.mana;
        mana.consume(cost.state.current, this);
        
        const desc = this.state.desc;
        DebugUtil.log(`Use Skill: ${desc}`);
        this.execute(...params);
        if (!this.state.async) this.end();
    }

    protected end() {
        this.event.onRun(new Event({}));
    }

    protected abstract execute(...params: Array<T | undefined>): void;

    protected abstract prepare(...params: Array<T | undefined>): Selector<T> | undefined;
}