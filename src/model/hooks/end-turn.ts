import { Model } from "set-piece";
import { CardModel } from "../card";
import { RoleModel } from "../role";

export namespace EndTurnHookModel {
    export type Event = {
        onRun: {};
        toRun: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class EndTurnHookModel<
    E extends Partial<EndTurnHookModel.Event> & Model.Event = {},
    S extends Partial<EndTurnHookModel.State> & Model.State = {},
    C extends Partial<EndTurnHookModel.Child> & Model.Child = {},
    R extends Partial<EndTurnHookModel.Refer> & Model.Refer = {}
> extends Model<
    E & EndTurnHookModel.Event,
    S & EndTurnHookModel.State,
    C & EndTurnHookModel.Child,
    R & EndTurnHookModel.Refer
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { ...route, card, role };
    }

    public async run() {
        this.event.toRun({});
        await this.doRun();
        this.event.onRun({});
    }

    protected abstract doRun(): Promise<void>;
}