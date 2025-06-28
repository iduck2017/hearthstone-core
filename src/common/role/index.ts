import { DebugService, Event, EventAgent, LogLevel, Model, State, TranxService } from "set-piece";
import { MinionCardModel } from "../card/minion";
import { HeroModel } from "../hero";
import { FeatureModel } from "../feature";
import { EffectModel } from "../feature/effect";

// 1damage/5health/2refHealth/3modHealth

export namespace RoleModel {
    export type Parent = MinionCardModel | HeroModel
    export type State = {
        readonly attack: number;
        readonly health: number;
        readonly modHealth: number;
        refHealth: number;
        damage: number;
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
                refHealth: 0,
                damage: 0,
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
        const isEnrage = curHealth < maxHealth;
        return {
            ...state,
            maxHealth,
            curHealth,
            isEnrage,
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
        const sourceAttack = this.state.attack;
        const targetAttack = target.state.attack;
        this.dealDamage(target, sourceAttack);
        target.dealDamage(this, targetAttack);
        this.event.onAttack(target);
    }
    
    @EventAgent.next(self => self.event.onDamageDeal)
    public dealDamage(target: RoleModel, damage: number) {
        target.recvDamage(this, damage);
        return { target, damage };
    }

    @DebugService.log()
    @EventAgent.next(self => self.event.onDamageRecv)
    @TranxService.use()
    public recvDamage(source: RoleModel, damage: number) {
        this.draft.state.damage += damage;
        return { source, damage };
    }

    @DebugService.log()
    @EventAgent.use((self: RoleModel) => self.proxy.event.onStateChange)
    @TranxService.use()
    private handleRawHealthBalance(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { refHealth, maxHealth, damage } = event.next;
        const dltHealth = refHealth - maxHealth;
        if (dltHealth > 0) this.draft.state.damage -= Math.min(damage, dltHealth);
        if (dltHealth !== 0) that.draft.state.refHealth = maxHealth;
    }

    @DebugService.log(LogLevel.WARN)
    @EventAgent.use((self: RoleModel) => self.proxy.event.onStateChange)
    @TranxService.use()
    private handleMaxHealthBalance(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const {
            tmpDamage,
            rawDamage,
            tmpHealth,
        } = event.next;
        if (rawDamage <= 0) return;
        if (tmpDamage >= tmpHealth) return;
        console.log('Imbalance2', event.next);
        this.draft.state.rawDamage -= Math.min(tmpHealth - tmpDamage, rawDamage);
        this.draft.state.tmpDamage += Math.min(tmpHealth - tmpDamage, rawDamage);
    }
}