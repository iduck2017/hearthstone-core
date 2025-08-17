import { Model } from "set-piece";
import { CardModel } from "../card";
import { RoleModel } from "../role";
import { FeatureModel } from "../features";

export namespace DeathrattleModel {
    export type Event = {
        toRun: { isAbort?: boolean };
        onRun: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class DeathrattleModel<
    E extends Partial<DeathrattleModel.Event> & Model.Event = {},
    S extends Partial<DeathrattleModel.State> & Model.State = {},
    C extends Partial<DeathrattleModel.Child> & Model.Child = {},
    R extends Partial<DeathrattleModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    E & DeathrattleModel.Event, 
    S & DeathrattleModel.State, 
    C & DeathrattleModel.Child, 
    R & DeathrattleModel.Refer
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { ...route, card, role };
    }

    constructor(props: DeathrattleModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'desc' | 'name'>;
        child: C;
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
        if (!this.state.isActive) return;
        const signal = this.event.toRun({});
        if (signal.isAbort) return;
        await this.doRun();
        this.event.onRun({});
    }

    protected abstract doRun(): Promise<void>;
}