import { Model, Route } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./players";
import { BoardModel } from "./containers/board";
import { HandModel } from "./containers/hand";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { CardModel, DeathModel } from "..";
import { ActionModel } from "./rules/action";
import { AttackModel } from "./rules/attack";
import { HealthModel } from "./rules/health";
import { SleepModel } from "./rules/sleep";
import { FeaturesModel } from "./features";
import { RoleEntriesModel } from "./entries";
import { AnchorModel } from "..";

export namespace RoleModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly death: DeathModel;
        readonly sleep: SleepModel;
        readonly health: HealthModel;
        readonly attack: AttackModel;
        readonly action: ActionModel;
        readonly entries: RoleEntriesModel;
        readonly features: FeaturesModel;
        readonly anchor: AnchorModel ;
    };
    export type Refer = {};
}

export class RoleModel<
    E extends Partial<RoleModel.Event> & Model.Event = RoleModel.Event,
    S extends Partial<RoleModel.State> & Model.State = RoleModel.State,
    C extends Partial<RoleModel.Child> & Model.Child = RoleModel.Child,
    R extends Partial<RoleModel.Refer> & Model.Refer = RoleModel.Refer
> extends Model<
    E & RoleModel.Event,
    S & RoleModel.State,
    C & RoleModel.Child,
    R & RoleModel.Refer
> {
    public get route(): Route & {
        card?: CardModel;
        hand?: HandModel;
        deck?: DeckModel;
        game?: GameModel;
        player?: PlayerModel;
        board?: BoardModel;
        graveyard?: GraveyardModel;
    } {
        const route = super.route;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        return {
            ...super.route, 
            card, 
            hand: route.path.find(item => item instanceof HandModel),
            deck: route.path.find(item => item instanceof DeckModel),
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
            board: route.path.find(item => item instanceof BoardModel),
            graveyard: route.path.find(item => item instanceof GraveyardModel),
        };
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            health: this.child.health.state.current,
            attack: this.child.attack.state.current,
            action: this.child.action.state.current,
        }
    }

    public constructor(props: RoleModel['props'] & {
        state: S;
        child: C & Pick<RoleModel.Child, 'health' | 'attack'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                death: new DeathModel({}),
                sleep: new SleepModel({}),
                action: new ActionModel({}),
                anchor: new AnchorModel({}),
                entries: new RoleEntriesModel({}),
                features: new FeaturesModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}