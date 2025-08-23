import { Model } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { HeroModel } from "../heroes";
import { BoardModel } from "../player/board";
import { HandModel } from "../player/hand";
import { DeckModel } from "../player/deck";
import { GraveyardModel } from "../player/graveyard";
import { MinionCardModel } from "../card/minion";
import { DeathModel } from "../..";
import { ActionModel } from "./action";
import { AttackModel } from "./attack";
import { HealthModel } from "./health";
import { SleepModel } from "./sleep";
import { FeaturesModel } from "../features/group";
import { RoleEntriesModel } from "./entries";
import { AnchorModel } from "../..";

export namespace RoleModel {
    export type State = {};
    export type Event = {
        onSummon: {};
    };
    export type Child = {
        death: DeathModel;
        sleep: SleepModel;
        health: HealthModel;
        attack: AttackModel;
        action: ActionModel;
        entries: RoleEntriesModel;
        features: FeaturesModel;
        anchor: AnchorModel ;
    };
    export type Refer = {};
}

export class RoleModel extends Model<
    RoleModel.Event,
    RoleModel.State,
    RoleModel.Child,
    RoleModel.Refer
> {
    public get route() {
        const route = super.route;
        const hero: HeroModel | undefined = route.path.find(item => item instanceof HeroModel);
        const card: MinionCardModel | undefined = route.path.find(item => item instanceof MinionCardModel);
        return { 
            ...super.route, 
            hero, 
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
        child: Pick<RoleModel.Child, 'health' | 'attack'>;
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

    public summon() {
        this.event.onSummon({});
    }
}