import { DebugService, Event, EventAgent, Model, State, TranxService } from "set-piece";
import { MinionCardModel } from "./card/minion";
import { HeroModel } from "./hero";
import { FeatureModel } from "./feature";

export namespace RoleModel {
    export type Parent = MinionCardModel | HeroModel
    export type State = {
        attack: number;
        health: number;
        curHealth: number;
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
        onResetBefore: {
            attack?: number;
            health?: number;
        }
    };
    export type Child = {
        readonly features: Readonly<FeatureModel[]>;
        readonly effect: FeatureModel[];
    };
    export type Refer = {};
}

export class RoleModel<
    P extends HeroModel | MinionCardModel = HeroModel | MinionCardModel,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<
    P,
    E & RoleModel.Event,
    S & RoleModel.State,
    C & RoleModel.Child,
    R & RoleModel.Refer
> {
    public get alias(): RoleModel { return this; }

    public constructor(props: RoleModel['props'] & {
        state: S & Pick<RoleModel.State, 'attack' | 'health'>,
        child: C,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: {
                curHealth: props.state.health,
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

    public get state(): State<RoleModel.State & S> & {
        readonly health: number;
    } {
        const result = super.state;
        return {
            ...result,
            curHealth: this.draft.state.curHealth,
        };
    }

    public apply(feature: FeatureModel) {
        this.child.effect.push(feature);
        return feature;
    }
    
    @DebugService.log()
    @TranxService.use()
    public attack(target: RoleModel) {
        this.alias.event.onAttackBefore(target);
        const sourceAttack = this.state.attack;
        const targetAttack = target.state.attack;
        this.dealDamage(target, sourceAttack);
        target.dealDamage(this, targetAttack);
        this.alias.event.onAttack(target);
    }
    
    public dealDamage(target: RoleModel, damage: number) {
        target.recvDamage(this, damage);
        this.alias.event.onDamageDeal({ target, damage });
    }

    public recvDamage(source: RoleModel, damage: number) {
        this.alias.draft.state.curHealth -= damage;
        this.alias.event.onDamageRecv({ source, damage });
    }


    @TranxService.use()
    public reset(option: {
        attack?: number,
        health?: number
    }) {
        this.alias.event.onResetBefore(option)
        if (option.attack) this.alias.draft.state.attack = option.attack;
        if (option.health) this.alias.draft.state.health = option.health;
    }
    
    @EventAgent.use(self => self.proxy.event.onStateChange)
    private handleHealthUpdate(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { prev, next } = event;
        if (prev.health !== next.health) {
            const dltHealth = next.health - prev.health;
            if (dltHealth > 0) this.alias.draft.state.curHealth += dltHealth;
            if (dltHealth < 0 && this.state.curHealth > next.health) this.alias.draft.state.curHealth = next.health;
        }
    }
}