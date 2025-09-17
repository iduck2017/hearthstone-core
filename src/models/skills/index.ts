import { Event, Method, Model, Props } from "set-piece";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CostModel } from "../rules/cost";
import { HeroModel } from "../heroes";
import { DamageModel } from "../actions/damage";

export namespace SkillProps {
    export type E = {
        toRun: Event,
        onRun: Event
    };
    export type S = {
        desc: string,
        name: string;
    };
    export type C = {
        cost: CostModel,
    };
    export type R = {};
    export type P = {
        hero: HeroModel;
        game: GameModel;
        player: PlayerModel;
    }
}

export abstract class SkillModel<
    T extends Model[] = Model[],
    E extends Partial<SkillProps.E> & Props.E = {},
    S extends Partial<SkillProps.S> & Props.S = {},
    C extends Partial<SkillProps.C> & Props.C = {},
    R extends Partial<SkillProps.R> & Props.R = {},
> extends Model<
    E & SkillProps.E,
    S & SkillProps.S,
    C & SkillProps.C,
    R & SkillProps.R,
    SkillProps.P
> {
    constructor(loader: Method<SkillModel['props'] & {
        uuid: string | undefined;
        state: S & SkillProps.S;
        child: C & Pick<SkillProps.C, 'cost'>;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    damage: props.child?.damage ?? new DamageModel(),
                    ...props.child
                },
                refer: { ...props.refer },
                route: {
                    hero: HeroModel.prototype,
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                },
            }
        });
    }

    public async run() {
        // prepare
        const player = this.route.player;
        if (!player) return;
        const cost = this.child.cost;
        if (!cost.status) return;
        
        const signal = new Event();
        this.event.toRun(signal);
        if (signal.isCancel) return;

        const event = this.toRun();
        if (!event) return;
        const params: Model[] = [];
        for (const item of event) {
            const result = await SelectUtil.get(item);
            if (result === undefined) return;
            params.push(result);
        }
        
        // execute
        const mana = player.child.mana;
        mana.use(cost.state.current);
        const self: SkillModel = this;
        await self.doRun(...params);
        this.event.onRun(new Event());
    }

    protected abstract doRun(...params: T): Promise<void>;

    protected abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}