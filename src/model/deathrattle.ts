import { EventUtil, Model } from "set-piece";
import { CardModel } from "./card";
import { RootModel } from "./root";

export namespace DeathrattleModel {
    export type Event = {
        onRun: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class DeathrattleModel<
    T extends Model[] = Model[],
    E extends Partial<DeathrattleModel.Event> & Model.Event = {},
    S extends Partial<DeathrattleModel.State> & Model.State = {},
    C extends Partial<DeathrattleModel.Child> & Model.Child = {},
    R extends Partial<DeathrattleModel.Refer> & Model.Refer = {}
> extends Model<
    E & DeathrattleModel.Event, 
    S & DeathrattleModel.State, 
    C & DeathrattleModel.Child, 
    R & DeathrattleModel.Refer
> {
    constructor(props: DeathrattleModel['props'] & {
        uuid: string | undefined;
        state: S;
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

    public get route(): Readonly<Partial<{
        root: RootModel;
        parent: Model;
        card: CardModel;
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const card = route.parent instanceof CardModel ? route.parent : undefined;
        return {
            ...route,
            root,
            card,
        }
    }

    public async run(...target: T) {
        await this._run(...target);
        await this.event.onRun({});
    }

    protected abstract _run(...target: T): Promise<void>;
}