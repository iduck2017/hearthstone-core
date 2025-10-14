import { Event, Method, Model } from "set-piece";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CostModel } from "../rules/card/cost";
import { HeroModel } from "../heroes";
import { DamageModel } from "../rules/card/damage";
import { AbortEvent } from "../../types/abort-event";

export namespace SkillModel {
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
}

export abstract class SkillModel<
    T extends Model[] = Model[],
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
    public get chunk() {
        return {
            state: this.state,
            child: {
                cost: this.origin.child.cost.chunk,
            }
        }
    }

    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.list.find(item => item instanceof PlayerModel),
            game: result.list.find(item => item instanceof GameModel),
            hero: result.list.find(item => item instanceof HeroModel),
        }
    }

    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S & SkillModel.S;
        child: C & Pick<SkillModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                damage: props.child?.damage ?? new DamageModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }

    public async run() {
        // prepare
        const player = this.route.player;
        if (!player) return;
        const cost = this.child.cost;
        if (!cost?.status) return;
        
        const event = new AbortEvent({});
        this.event.toRun?.(event);
        if (event.detail.isAbort) return;

        const options = this.toRun();
        if (!options) return;
        const params: Model[] = [];
        for (const item of options) {
            const result = await SelectUtil.get(item);
            if (result === undefined) return;
            params.push(result);
        }
        
        // execute
        const mana = player.child.mana;
        mana.consume(cost.state.current, this);
        const self: SkillModel = this;
        await self.doRun(...params);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(...params: T): Promise<void>;

    protected abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}