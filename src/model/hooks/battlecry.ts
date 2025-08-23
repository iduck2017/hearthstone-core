import { Model } from "set-piece";
import { CardModel } from "../card";
import { SelectEvent } from "../../utils/select";
import { RoleModel } from "../role";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { FeatureModel } from "../features";
import { AbortEvent } from "../../utils/abort";
import { AnchorModel } from "../anchor";

export namespace BattlecryModel {
    export type Event = {
        toRun: AbortEvent;
        onRun: { params: any[] };
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class BattlecryModel<
    T extends any[] = any[],
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
        return { 
            ...route, 
            card, 
            player: route.path.find(item => item instanceof PlayerModel),
            game: route.path.find(item => item instanceof GameModel)
        };
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
                status: 1,
                ...props.state,
            },
            child: {
                anchor: new AnchorModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public async run(...params: T) {
        if (!this.state.status) return;
        const event = this.event.toRun(new AbortEvent());
        if (event.isAbort) return;
        await this.doRun(...params);
        this.event.onRun({ params });
    }

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}