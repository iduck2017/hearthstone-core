import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { FeatureModel } from "./features";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { HeroModel } from "./heroes";
import { FilterType } from "../types";
import { BoardModel } from "./player/board";
import { HandModel } from "./player/hand";
import { DeckModel } from "./player/deck";
import { DamageForm, DamageModel, DamageType } from "./heroes/damage";
import { CardModel } from "./card";
import { DeathUtil } from "../utils/death";
import { GraveyardModel } from "./player/graveyard";
import { SelectUtil } from "../utils/select";
import { MinionCardModel } from "./card/minion";
import { DevineSheildModel } from "./entries/devine-shield";

export type RoleCheckInfo = {
    onHand?: FilterType;
    onDeck?: FilterType;
    onBoard?: FilterType;
    isAlive?: FilterType;
}

export namespace RoleModel {
    export type State = {
        rawAttack: number;
        modAttack: number;
        rawHealth: number;
        modHealth: number;
        refHealth: number;
        damage: number;
        action: number;
        /** death */
        isDead: boolean;
        isDestroyed: boolean;
        isTaunt: boolean;
        isRush: boolean;
        isWindfury: number;
        isStealth: boolean;
        isCharge: boolean;
    };
    export type Event = {
        toAttack: { target: RoleModel, isAbort: boolean };
        onAttack: { target: RoleModel };
        toHurt: DamageForm;
        onHurt: DamageForm;
        onDie: {};
    };
    export type Child = {
        features: FeatureModel[];
        devineShield: DevineSheildModel;
    };
    export type Refer = {
        murderer?: DamageModel;
    };
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

    public get refer() {
        const hero = this.route.hero;
        const card = this.route.card;
        const damage = hero?.child.damage ?? card?.child.damage;
        return { ...super.refer, damage }
    }

    public get state() {
        const state = super.state;
        const maxHealth = state.rawHealth + state.modHealth;
        const refHealth = Math.max(state.refHealth, maxHealth);
        return {
            ...state,
            maxHealth,
            health: Math.min(refHealth - state.damage, maxHealth),
            attack: state.rawAttack + state.modAttack,
        }
    }

    public constructor(props: RoleModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<RoleModel.State, 'rawAttack' | 'rawHealth'>,
        child: C,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { 
                modAttack: 0,
                modHealth: 0,
                refHealth: props.state.rawHealth,
                damage: 0,
                action: 0,
                isDevineSheild: false,
                isTaunt: false,
                isRush: false,
                isDead: false,
                isDestroyed: false,
                isWindfury: false,
                isCharge: false,
                isStealth: false,
                ...props.state 
            },
            child: { 
                features: [],
                devineShield: new DevineSheildModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public addFeature(feature: FeatureModel) {
        this.draft.child.features.push(feature);
        return feature;
    }

    public startTurn() {
        this.draft.state.action = 1 + this.state.isWindfury;
    }

    /** hurt */
    public toHurt(form: DamageForm) {
        return this.event.toHurt(form);
    }

    @TranxUtil.span()
    public doHurt(form: DamageForm): DamageForm {
        const result = form.result;
        if (result <= 0) return { ...form, result: 0 }
        if (this.child.devineShield.state.isActive) {
            this.child.devineShield.use();
            return { ...form, result: 0 }
        }
        this.draft.state.damage += result;
        if (this.state.health <= result) {
            this.draft.state.isDead = true;
            this.draft.refer.murderer = form.source;
            DeathUtil.add(this);
        }
        return { ...form, result };
    }

    public onHurt(form: DamageForm) {
        return this.event.onHurt(form);
    }

    /** die */
    public onDie() {
        return this.event.onDie({});
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
    

    @DebugUtil.log()
    public async attack() {
        if (!this.route.game) return;
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        const targets = this.route.game.query({ side: opponent });
        const target = await SelectUtil.get({ targets })
        if (!target) return;
        const signal = this.event.toAttack({ target, isAbort: false })
        if (signal.isAbort) return;
        if (!target.refer.damage || !this.refer.damage) return;
        if (this.draft.state.action <= 0) return;
        this.draft.state.action --;
        DamageModel.deal([
            {
                target,
                source: this.refer.damage,
                damage: this.state.attack,
                result: this.state.attack,
                type: DamageType.ATTACK,
            },
            { 
                target: this, 
                source: target.refer.damage, 
                damage: target.state.attack,
                result: target.state.attack,
                type: DamageType.DEFEND,
            }
        ])
        this.event.onAttack({ target }) 
    }
    
    @EventUtil.on(self => self.proxy.event.onStateChange)
    @DebugUtil.log()
    @TranxUtil.span()
    private onStateChange(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { refHealth, maxHealth, damage } = event.next;
        const offset = refHealth - maxHealth;
        if (offset !== 0) console.warn('imbalance', refHealth, maxHealth);
        if (offset !== 0) this.draft.state.refHealth = maxHealth;
        if (offset > 0) this.draft.state.damage -= Math.min(damage, offset);
    }
}