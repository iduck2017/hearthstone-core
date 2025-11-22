import { DebugUtil, Event, Method, Model } from "set-piece";
import { PlayerModel } from "./player";
import { GameModel } from "./game";
import { CostModel } from "../features/rules/cost";
import { HeroModel, RoleModel } from "./heroes";
import { DamageModel } from "../features/rules/damage";
import { AbortEvent } from "../../types/events/abort";
import { EffectModel } from "../features/hooks/effect";
import { MinionCardModel } from "./cards/minion";
import { SkillHooksConfig, SkillPerformModel } from "../features/perform/skill";


export namespace SkillModel {
    export type E = {};
    export type S = {
        desc: string,
        name: string;
    };
    export type C = {
        cost: CostModel,
        effects: EffectModel[];
        perform: SkillPerformModel;
    };
    export type R = {};
}

export abstract class SkillModel<
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

    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<SkillModel.S, 'name' | 'desc'>;
        child: C & Pick<SkillModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                damage: props.child?.damage ?? new DamageModel(),
                effects: props.child?.effects ?? [],
                perform: props.child?.perform ?? new SkillPerformModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }

    public async use() {
        await this.child.perform.run()
    }
}