import { Model } from "set-piece";
import { CardModel } from "./card";
import { RootModel } from "./root";
import { SelectOption } from "../utils/select";

export namespace BattlecryModel {
    export type Event = {
        name: string;
        desc: string;
        onUse: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class BattlecryModel<
    T extends Model[] = Model[],
    E extends Partial<BattlecryModel.Event> & Model.Event = {},
    S extends Partial<BattlecryModel.State> & Model.State = {},
    C extends Partial<BattlecryModel.Child> & Model.Child = {},
    R extends Partial<BattlecryModel.Refer> & Model.Refer = {}
> extends Model<
    E & BattlecryModel.Event, 
    S & BattlecryModel.State, 
    C & BattlecryModel.Child, 
    R & BattlecryModel.Refer
> {
    constructor(props: BattlecryModel['props'] & {
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

    public get route(): Model['route'] & Readonly<Partial<{
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

    public abstract toPlay(): { [K in keyof T]: SelectOption<T[K]> } | undefined;
    
    protected abstract check(): boolean;

    public async run(...target: T) {
        if (!this.check()) return;
        await this._run(...target);
        await this.event.onUse({});
    }

    protected abstract _run(...target: T): Promise<void>;
}