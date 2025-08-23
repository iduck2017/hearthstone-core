import { Model, TranxUtil } from "set-piece";
import { AbortEvent, AnchorModel, RoleModel } from "../..";
import { CardModel } from "../..";
import { PlayerModel } from "../..";
import { GameModel } from "../..";
import { BoardModel } from "../..";

export namespace FeatureModel {
    export type State = {
        name: string;
        desc: string;
        isActive: boolean;
    }
    export type Event = {
        toSilence: AbortEvent;
        onSilence: {};
    };
    export type Child = {
        anchor: AnchorModel;
    };
    export type Refer = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureModel.Event> & Model.Event = {},
    S extends Partial<FeatureModel.State> & Model.State = {},
    C extends Partial<FeatureModel.Child> & Model.Child = {},
    R extends Partial<FeatureModel.Refer> & Model.Refer = {}
> extends Model<
    E & FeatureModel.Event,
    S & FeatureModel.State,
    C & FeatureModel.Child,
    R & FeatureModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        return { 
            ...route, 
            role, 
            card,
            game: route.path.find(item => item instanceof GameModel),
            board: route.path.find(item => item instanceof BoardModel),
            player: route.path.find(item => item instanceof PlayerModel)
        }
    } 

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'name' | 'desc' | 'isActive'>;
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                anchor: new AnchorModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public silence() {
        const event = this.event.toSilence(new AbortEvent());
        if (event.isAbort) return;
        this.disable();
        this.event.onSilence({});
        return true;
    }

    @TranxUtil.span()
    public disable() {
        this.draft.state.isActive = false;
        this.doDisable();
    }

    protected abstract doDisable(): void;
}