import { Model } from "set-piece";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { AbortEvent } from "../../utils/abort";
import { PlayerModel } from "../players";
import { GameModel } from "../game";
import { CostModel } from "../rules/cost";
import { AnchorModel } from "../rules/anchor";

export namespace SkillModel {
    export type Event = {
        toRun: AbortEvent,
        onRun: {}
    };
    export type State = {
        desc: string,
        name: string;
    };
    export type Child = {
        cost: CostModel,
        anchor: AnchorModel
    };
    export type Refer = {};
}

export abstract class SkillModel<
    T extends Model[] = Model[],
    E extends Partial<SkillModel.Event> & Model.Event = {},
    S extends Partial<SkillModel.State> & Model.State = {},
    C extends Partial<SkillModel.Child> & Model.Child = {},
    R extends Partial<SkillModel.Refer> & Model.Refer = {},
> extends Model<
    E & SkillModel.Event,
    S & SkillModel.State,
    C & SkillModel.Child,
    R & SkillModel.Refer
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            player: route.path.find(item => item instanceof PlayerModel),
            game: route.path.find(item => item instanceof GameModel),
        }
    }

    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S & SkillModel.State;
        child: C & Pick<SkillModel.Child, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                anchor: new AnchorModel({}),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    public async run() {
        const event = this.event.toRun(new AbortEvent());
        if (event.isAbort) return;
        const events = this.toRun();
        if (!events) return;
        const params: Model[] = [];
        for (const item of events) {
            const result = await SelectUtil.get(item);
            if (result === undefined) return;
            params.push(result);
        }
        const self: SkillModel = this;
        await self.doRun(...params);
        this.event.onRun({ params });
    }

    protected abstract doRun(...params: T): Promise<void>;

    protected abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}