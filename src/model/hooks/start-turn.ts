import { Model } from "set-piece";
import { CardModel } from "../card";
import { RoleModel } from "../role";
import { EndTurnHookModel } from "./end-turn";
import { FeatureModel } from "../features";

export namespace StartTurnHookModel {
    export type Event = {
        onRun: {};
        toRun: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class StartTurnHookModel<
    E extends Partial<StartTurnHookModel.Event> & Model.Event = {},
    S extends Partial<StartTurnHookModel.State> & Model.State = {},
    C extends Partial<StartTurnHookModel.Child> & Model.Child = {},
    R extends Partial<StartTurnHookModel.Refer> & Model.Refer = {}
> extends Model<
    E & StartTurnHookModel.Event,
    S & StartTurnHookModel.State,
    C & StartTurnHookModel.Child,
    R & StartTurnHookModel.Refer
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { ...route, card, role };
    }

    constructor(props: EndTurnHookModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
    
    public async run() {
        if (!this.state.isActive) return;
        this.event.toRun({});
        await this.doRun();
        this.event.onRun({});
    }

    protected abstract doRun(): Promise<void>;
}