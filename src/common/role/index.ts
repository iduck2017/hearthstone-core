import { CheckService, DebugService, Event, EventAgent, LogLevel, Model, State, TranxService } from "set-piece";
import { MinionCardModel } from "../card/minion";
import { HeroModel } from "../hero";
import { FeatureModel } from "../feature";
import { EffectModel } from "../feature/effect";
import { RootModel } from "../root";
import { GameModel } from "../game";
import { TargetType } from "@/types/query";
import { Selector } from "@/utils/selector";
import { PlayerModel } from "../player";
import { Optional } from "@/types";

// 1damage/5health/2refHealth/3modHealth

export namespace RoleModel {
    export type Parent = MinionCardModel | HeroModel
    export type State = {
        damage: number;
        action: number;
        readonly attack: number;
        readonly health: number;
        readonly modHealth: number;
        readonly modAttack: number;
        refHealth: number;
        isRush: boolean;
        isTaunt: boolean;
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
        return {
            ...state,
            maxHealth,
            curHealth,
            curAttack,
        };
    }

    public get route(): Readonly<Optional<{
        parent: P;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel,
        opponent: PlayerModel,
    }>> {
        const route = super.route;
        const parent = route.parent;
        return {
            parent: route.parent,
            root: parent?.route.root,
            game: parent?.route.game,
            owner: parent?.route.owner,
            opponent: parent?.route.opponent,
        }
    }

    public affect(effect: EffectModel) {
        this.draft.child.effect.push(effect);
        return effect;
    }

    @TranxService.use()
    public startTurn() {
        this.draft.state.action += 1;
    }

    @TranxService.use()
    public endTurn() {
        this.draft.state.action = 0;
        this.draft.state.isRush = false;
    }

    @DebugService.log()
    public async prepareAttack() {
        if (this.state.action <= 0) return;
        const candidates = this.route.game?.query(TargetType.Role, {
            isTaunt: true,
            isRush: this.state.isRush,
            side: this.route.opponent
        });
        if (!candidates) return;
        const target = await new Selector(candidates, '').get();
        if (!target) return;
        this.attack(target);        
    }
    
    @DebugService.log()
    @TranxService.use()
    public attack(target: RoleModel) {
        this.event.onAttackBefore(target);
        const sourceAttack = this.state.curAttack;
        const targetAttack = target.state.curAttack;
        this.draft.state.action--;
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
        if (dltHealth !== 0) console.warn('imbalance', refHealth, maxHealth);
        if (dltHealth > 0) this.draft.state.damage -= Math.min(damage, dltHealth);
        if (dltHealth !== 0) that.draft.state.refHealth = maxHealth;
    }
}