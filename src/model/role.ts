import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { EffectModel } from "./feature/effect";
import { RootModel } from "./root";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { CardModel } from "./card";
import { SelectUtil } from "../utils/select";
import { DamageUtil } from "../utils/damage";

export namespace RoleModel {
    export type State = {
        damage: number;
        action: number;
        readonly attack: number;
        readonly health: number;
        readonly modHealth: number;
        readonly modAttack: number;
        refHealth: number;
        isDestroy: boolean;
        isDead: boolean;
        isRush: boolean;
        isTaunt: boolean;
        isShield: boolean;
    };
    export type Event = {
        toAttack: RoleModel;
        onAttack: RoleModel;
        onSummon: {},
        onDealDamage: {
            target: RoleModel;
            damage: number;
        };
        onRecvDamage: {
            source: Model;
            damage: number;
        };
    };
    export type Child = {
        readonly effect: EffectModel[];
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
    public constructor(props: RoleModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<RoleModel.State, 'attack' | 'health'>,
        child: C,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: {
                modHealth: 0,
                modAttack: 0,
                refHealth: props.state.health,
                damage: 0,
                action: 0,
                isDestroy: false,
                isDead: false,
                isRush: false,
                isTaunt: false,
                isShield: false,
                ...props.state 
            },
            child: { 
                features: [],
                effect: [],
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public get state() {
        const state = super.state;
        const maxHealth = state.health + state.modHealth;
        const refHealth = Math.max(state.refHealth, maxHealth);
        const curHealth = Math.min(refHealth - state.damage, maxHealth);
        const curAttack = state.attack + state.modAttack;
        const isDead = state.isDestroy ? false : state.isDead
        return {
            ...state,
            maxHealth,
            curHealth,
            curAttack,
            isDead,
        };
    }

    public get route(): Readonly<Partial<{
        parent: Model;
        root: RootModel;
        card: CardModel;
        game: GameModel;
        owner: PlayerModel,
        opponent: PlayerModel,
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const card = route.parent instanceof CardModel ? route.parent : undefined;
        const owner = card?.route.owner;
        const opponent = card?.route.opponent;
        const game = root?.child.game;
        return {
            ...route,
            root,
            game,
            card,
            owner,
            opponent,
        }
    }

    public affect(effect: EffectModel) {
        this.draft.child.effect.push(effect);
        return effect;
    }

    @TranxUtil.span()
    public startTurn() {
        this.draft.state.action += 1;
    }

    @TranxUtil.span()
    public endTurn() {
        this.draft.state.action = 0;
        this.draft.state.isRush = false;
    }

    @DebugUtil.log()
    public async toAttack() {
        // if (this.state.action <= 0) return;
        // const candidates = this.route.game?.query({
        //     isTaunt: true,
        //     isRush: this.state.isRush,
        //     side: this.route.opponent
        // });
        // if (!candidates) return;
        // const selector = new SelectUtil(candidates, 'target');
        // const target = await selector.get();
        // if (!target) return;
        // this.event.toAttack(target);
        // this.attack(target);
    }
    
    @DebugUtil.log()
    @TranxUtil.span()
    public attack(target: RoleModel) {
        this.draft.state.action -= 1;
        DamageUtil.toRun([
            { target, source: this, damage: this.state.curAttack },
            { target: this, source: target, damage: target.state.curAttack }
        ])
        this.event.onAttack(target);
    }

    @DebugUtil.log()
    @TranxUtil.span()
    public recvDamage(options: { damage: number, source: RoleModel }) {
        const { damage, source } = options;
        if (this.state.isShield) {
            this.draft.state.isShield = false;
            return 0
        }
        this.draft.state.damage += damage;
        if (this.state.curHealth <= 0) {
            this.draft.state.isDead = true;
        }
        return damage;
    }

    public onDealDamage(options: { damage: number,  target: RoleModel }) {
        this.event.onDealDamage(options)
    }

    public onRecvDamage(options: { damage: number, source: RoleModel }) {
        this.event.onRecvDamage(options);
    }

    @DebugUtil.log()
    @EventUtil.on((self: RoleModel) => self.proxy.event.onStateChange)
    @TranxUtil.span()
    private onHealthChange(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { refHealth, maxHealth, damage } = event.next;
        const dltHealth = refHealth - maxHealth;
        if (dltHealth !== 0) console.warn('imbalance', refHealth, maxHealth);
        if (dltHealth > 0) this.draft.state.damage -= Math.min(damage, dltHealth);
        if (dltHealth !== 0) that.draft.state.refHealth = maxHealth;
    }

    public summon() {
        // const card = this.route.card;
        // const owner = this.route.owner;
        // if (!card || !owner) return;
        // owner.summon(card);
        // this.event.onSummon({});
    }
}