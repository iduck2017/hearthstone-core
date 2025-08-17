import { Model } from "set-piece";
import { CardModel } from "../card";
import { SelectForm } from "../../utils/select";
import { RoleModel } from "../role";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { FeatureModel } from "../features";

export namespace BattlecryModel {
    export type Event = {
        toRun: { isAbort?: boolean };
        onRun: { params: any[] };
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
> extends FeatureModel<
    E & BattlecryModel.Event, 
    S & BattlecryModel.State, 
    C & BattlecryModel.Child, 
    R & BattlecryModel.Refer
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { 
            ...route, 
            card, 
            role,
            player: route.path.find(item => item instanceof PlayerModel),
            game: route.path.find(item => item instanceof GameModel)
        };
    }

    public get refer() {
        const route = this.route;
        return {
            ...super.refer,
            damage: route.card?.child.damage,
        }
    }

    constructor(props: BattlecryModel['props'] & {
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
        });
    }

    public async run(...params: T) {
        if (!this.state.isActive) return;
        const signal = this.event.toRun({});
        if (signal.isAbort) return;
        await this.doRun(...params);
        this.event.onRun({ params });
    }

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectForm<T[K]> } | undefined;
}