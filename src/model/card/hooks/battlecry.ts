import { Model } from "set-piece";
import { CardModel } from "..";
import { SelectForm } from "../../../utils/select";
import { RoleModel } from "../../role";

export namespace BattlecryModel {
    export type Event = {
        onRun: { params: any[] };
    };
    export type State = {
        readonly name: string;
        readonly desc: string;
    };
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
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { ...route, card, role };
    }

    constructor(props: BattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<BattlecryModel.State, 'desc' | 'name'>;
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

    public async run(...params: T) {
        if (!this.toRun()) return;
        await this.doRun(...params);
        this.event.onRun({ params });
    }

    protected abstract toRun(): boolean;

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toPlay(): { [K in keyof T]: SelectForm<T[K]> } | undefined;
}