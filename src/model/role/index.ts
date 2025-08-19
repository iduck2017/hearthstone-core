import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { HeroModel } from "../heroes";
import { FilterType } from "../../types";
import { BoardModel } from "../player/board";
import { HandModel } from "../player/hand";
import { DeckModel } from "../player/deck";
import { DamageForm, DamageModel } from "../damage";
import { GraveyardModel } from "../player/graveyard";
import { MinionCardModel } from "../card/minion";
import { DevineSheildModel } from "../features/devine-shield";
import { WindfuryModel } from "../features/windfury";
import { DeathModel } from "./death";
import { ActionModel } from "./action";
import { RushModel } from "../features/rush";
import { ChargeModel } from "../features/charge";
import { AttackModel } from "./attack";
import { HealthModel } from "./health";
import { TauntModel } from "../features/taunt";
import { SleepModel } from "./sleep";
import { FrozenModel } from "../features/frozen";

export type RoleCheckInfo = {
    onHand?: FilterType;
    onDeck?: FilterType;
    onBoard?: FilterType;
    isAlive?: FilterType;
}

export namespace RoleModel {
    export type State = {};
    export type Event = {
        toAttack: { target: RoleModel, isAbort?: boolean };
        onAttack: { target: RoleModel };
        toHurt: DamageForm;
        onHurt: DamageForm;
        onSummon: {};
    };
    export type Child = {
        rush: RushModel;
        death: DeathModel;
        sleep: SleepModel;
        taunt: TauntModel;
        frozen: FrozenModel;
        health: HealthModel;
        attack: AttackModel;
        action: ActionModel;
        charge: ChargeModel;
        damage: DamageModel;
        windfury: WindfuryModel;
        features: FeatureModel[];
        devineShield: DevineSheildModel;
    };
    export type Refer = {};
}

export abstract class RoleModel<
    E extends Partial<RoleModel.Event> & Model.Event= {},
    S extends Partial<RoleModel.State> & Model.State = {},
    C extends Partial<RoleModel.Child> & Model.Child = {},
    R extends Partial<RoleModel.Refer> & Model.Refer = {}
> extends Model<
    E & RoleModel.Event,
    S & RoleModel.State,
    C & RoleModel.Child,
    R & RoleModel.Refer
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
        uuid: string | undefined;
        state: S,
        child: C & Pick<RoleModel.Child, 'health' | 'attack'>,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                features: [],
                rush: new RushModel({}),
                taunt: new TauntModel({}),
                death: new DeathModel({}),
                sleep: new SleepModel({}),
                frozen: new FrozenModel({}),
                action: new ActionModel({}),
                charge: new ChargeModel({}),
                damage: new DamageModel({}),
                windfury: new WindfuryModel({}),
                devineShield: new DevineSheildModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public affect(feature: FeatureModel) {
        this.draft.child.features.push(feature);
        return feature;
    }

    public check(options: RoleCheckInfo) {
        const { isAlive, onBoard, onHand, onDeck } = options;
        /** include */
        if (isAlive === FilterType.INCLUDE && this.state.isDead) return false;
        if (onBoard === FilterType.INCLUDE && !this.route.board) return false;
        if (onHand === FilterType.INCLUDE && !this.route.hand) return false;
        if (onDeck === FilterType.INCLUDE && !this.route.deck) return false;
        /** exclude */
        if (isAlive === FilterType.EXCLUDE && !this.state.isDead) return false;
        if (onBoard === FilterType.EXCLUDE && this.route.board) return false;
        if (onHand === FilterType.EXCLUDE && this.route.hand) return false;
        if (onDeck === FilterType.EXCLUDE && this.route.deck) return false;
        return true;
    }

    public summon() {
        this.event.onSummon({});
    }
}