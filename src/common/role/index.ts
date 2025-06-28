import { DebugService, Event, EventAgent, LogLevel, Model, State, TranxService } from "set-piece";
import { MinionCardModel } from "../card/minion";
import { HeroModel } from "../hero";
import { FeatureModel } from "../feature";
import { EffectModel } from "../feature/effect";

// 1damage/5health/2refHealth/3modHealth

export namespace RoleModel {
    export type Parent = MinionCardModel | HeroModel
    export type State = {
        damage: number;
        readonly attack: number;
        readonly health: number;
        readonly modHealth: number;
        readonly modAttack: number;
        refHealth: number;
        isShield: boolean;
    };
    export type Event = {
        onAttackBefore: RoleModel;
        onAttack: RoleModel;
        onDamageDeal: {
            target: RoleModel;
            damage: number;
        };
        onDamageRecv: {
            source: RoleModel;
            damage: number;
        };
    };
    export type Child = {
        readonly effect: EffectModel[];
    };
    export type Refer = {};
}

export abstract class RoleModel<
    P extends HeroModel | MinionCardModel = HeroModel | MinionCardModel,
    E extends Partial<RoleModel.Event> = {},
    S extends Partial<RoleModel.State> = {},
    C extends Partial<RoleModel.Child> & Model.Child = {},
    R extends Partial<RoleModel.Refer> & Model.Refer = {}
> extends Model<
    P,
    E & RoleModel.Event,
    S & RoleModel.State,
    C & RoleModel.Child,
    R & RoleModel.Refer
> {
    public constructor(props: RoleModel['props'] & {
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
        return {
            ...state,
            maxHealth,
            curHealth,
            curAttack,
        };
    }

    public apply(effect: EffectModel) {
        this.draft.child.effect.push(effect);
        return effect;
    }
    
    @DebugService.log()
    @TranxService.use()
    public attack(target: RoleModel) {
        this.event.onAttackBefore(target);
        const sourceAttack = this.state.curAttack;
        const targetAttack = target.state.curAttack;
        this.dealDamage(target, sourceAttack);
        target.dealDamage(this, targetAttack);
        this.event.onAttack(target);
    }
    
    public dealDamage(target: RoleModel, damage: number) {
        const result = target.recvDamage(this, damage);
        damage = result.damage;
        if (damage) this.event.onDamageDeal({ target, damage });
        return { target, damage };
    }

    @DebugService.log()
    @TranxService.use()
    public recvDamage(source: RoleModel, damage: number) {
        if (this.state.isShield) {
            this.draft.state.isShield = false;
            return { source, damage: 0};
        }
        this.draft.state.damage += damage;
        this.event.onDamageRecv({ source, damage });
        return { source, damage };
    }

    @DebugService.log()
    @EventAgent.use((self: RoleModel) => self.proxy.event.onStateChange)
    @TranxService.use()
    private handleBalance(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { refHealth, maxHealth, damage } = event.next;
        const dltHealth = refHealth - maxHealth;
        if (dltHealth > 0) this.draft.state.damage -= Math.min(damage, dltHealth);
        if (dltHealth !== 0) that.draft.state.refHealth = maxHealth;
    }
}