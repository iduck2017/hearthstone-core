import { Model } from "set-piece";
import { RoleFeatureModel } from "./feature";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { DeathModel } from "./death";
import { MinionCardModel } from "../card/minion";
import { DamageForm } from "../card/damage";
import { HeroModel } from "../hero";
import { FilterType } from "../../types";
import { BoardModel } from "../player/board";
import { HandModel } from "../player/hand";
import { DeckModel } from "../player/deck";
import { AttackModel } from "./attack";
import { HealthModel } from "./health";
import { ActionModel } from "./action";
import { RoleEntriesModel } from "./entries";

export type RoleCheckInfo = {
    onHand?: FilterType;
    onDeck?: FilterType;
    onBoard?: FilterType;
    isAlive?: FilterType;
}

export namespace RoleModel {
    export type State = {};
    export type Event = {
        toAttack: { target: RoleModel, isAbort: boolean };
        onAttack: { target: RoleModel };
        toRecvDamage: DamageForm
        onRecvDamage: DamageForm
        onDie: { death: DeathModel };
    };
    export type Child = {
        readonly features: RoleFeatureModel[];
        readonly death: DeathModel;
        readonly attack: AttackModel;
        readonly health: HealthModel;
        readonly action: ActionModel;
        readonly entries: RoleEntriesModel;
    };
    export type Refer = {};
}

export abstract class RoleModel<
    E extends Partial<RoleModel.Event> = {},
    S extends Partial<RoleModel.State> = {},
    C extends Partial<RoleModel.Child> & Model.Child = {},
    R extends Partial<RoleModel.Refer> & Model.Refer = {}
> extends Model<
    E & RoleModel.Event,
    S & RoleModel.State,
    C & RoleModel.Child,
    R & RoleModel.Refer
> {
    public get route() {
        const path = super.route.path;
        const game = path.find(item => item instanceof GameModel);
        const player = path.find(item => item instanceof PlayerModel);
        const hero: HeroModel | undefined = path.find(item => item instanceof HeroModel);
        const card: MinionCardModel | undefined = path.find(item => item instanceof MinionCardModel);
        return { ...super.route, hero, card, game, player };
    }

    public get refer() {
        const hero = this.route.hero;
        const card = this.route.card;
        const damage = hero?.child.damage ?? card?.child.damage;
        return { ...super.refer, damage }
    }

    public constructor(props: RoleModel['props'] & {
        uuid: string | undefined;
        state: S,
        child: C & Pick<RoleModel.Child, 'attack' | 'health'>,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                features: [],
                death: new DeathModel({}),
                action: new ActionModel({}),
                entries: new RoleEntriesModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public set(feature: RoleFeatureModel) {
        this.draft.child.features.push(feature);
        return feature;
    }

    public check(options: RoleCheckInfo) {
        const { isAlive, onBoard, onHand, onDeck } = options;
        const flag =   
            this.pipe(isAlive, this.child.death.state.isDead) &&
            this.pipe(onBoard, this.route.parent instanceof BoardModel) &&
            this.pipe(onHand, this.route.parent instanceof HandModel) &&
            this.pipe(onDeck, this.route.parent instanceof DeckModel)
        return flag;
    }
    
    private pipe(mode: FilterType | undefined, flag: boolean) {
        if (mode === FilterType.INCLUDE && !flag) return false;
        if (mode === FilterType.EXCLUDE && flag) return false;
        return true;
    }
}