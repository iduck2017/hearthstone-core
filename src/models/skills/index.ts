import { Event, Model, Props } from "set-piece";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CostModel } from "../rules/cost";
import { CharacterModel } from "../characters";

export namespace SkillProps {
    export type E = {
        toRun: Event,
        onRun: Event<{ params: Model[] }>
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
    E extends Partial<SkillProps.E> & Props.E = {},
    S extends Partial<SkillProps.S> & Props.S = {},
    C extends Partial<SkillProps.C> & Props.C = {},
    R extends Partial<SkillProps.R> & Props.R = {},
> extends Model<
    E & SkillProps.E,
    S & SkillProps.S,
    C & SkillProps.C,
    R & SkillProps.R
> {
    public get route() {
        const route = super.route;
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel);
        return {
            ...route,
            character,
            player: route.order.find(item => item instanceof PlayerModel),
            game: route.order.find(item => item instanceof GameModel),
        }
    }

    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S & SkillProps.S;
        child: C & Pick<SkillProps.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async run() {
        const signal = this.event.toRun(new Event({}));
        if (signal.isCancel) return;
        const event = this.toRun();
        if (!event) return;
        const params: Model[] = [];
        for (const item of event) {
            const result = await SelectUtil.get(item);
            if (result === undefined) return;
            params.push(result);
        }
        const self: SkillModel = this;
        await self.doRun(...params);
        this.event.onRun(new Event({ params }));
    }

    protected abstract doRun(...params: T): Promise<void>;

    protected abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}