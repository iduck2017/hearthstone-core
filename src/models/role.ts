import { Model } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { BoardModel } from "./containers/board";
import { HandModel } from "./containers/hand";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { DeathModel, MinionModel } from "..";
import { ActionModel } from "./rules/action";
import { AttackModel } from "./rules/attack";
import { HealthModel } from "./rules/health";
import { SleepModel } from "./rules/sleep";
import { FeaturesModel } from "./features/features";
import { RoleEntriesModel } from "./entries/role-entries";
import { CardModel } from "./cards";
import { CharacterModel } from "./characters";

export namespace RoleProps {
    export type S = {};
    export type E = {};
    export type C = {
        readonly death: DeathModel;
        readonly sleep: SleepModel;
        readonly health: HealthModel;
        readonly attack: AttackModel;
        readonly action: ActionModel;
        readonly entries: RoleEntriesModel;
        readonly feats: FeaturesModel;
    };
    export type R = {};
}

export class RoleModel extends Model<
    RoleProps.E,
    RoleProps.S,
    RoleProps.C,
    RoleProps.R
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel);
        const entity = character ?? card;
        return {
            ...super.route, 
            card, 
            minion,
            entity,
            character,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
            /** current position */
            hand: route.order.find(item => item instanceof HandModel),
            deck: route.order.find(item => item instanceof DeckModel),
            board: route.order.find(item => item instanceof BoardModel),
            graveyard: route.order.find(item => item instanceof GraveyardModel),
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
        child: Pick<RoleProps.C, 'health' | 'attack'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                death: props.child.death ?? new DeathModel({}),
                sleep: props.child.sleep ?? new SleepModel({}),
                action: props.child.action ?? new ActionModel({}),
                entries: props.child.entries ?? new RoleEntriesModel({}),
                feats: props.child.feats ?? new FeaturesModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}