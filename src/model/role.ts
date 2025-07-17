import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { EffectModel } from "./feature/effect";
import { RootModel } from "./root";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { CardModel } from "./card";
import { SelectUtil } from "../utils/select";
import { DamageConsumer, DamageProvider, DamageUtil } from "../utils/damage";
import { DevineSheildModel } from "./feature/devine-sheild";
import { DeathModel } from "./death";
import { MinionCardModel } from "./card/minion";
import { HeroCardModel } from "./card/hero";

export namespace RoleModel {
    export type State = {
        damage: number;
        action: number;
        readonly attack: number;
        readonly health: number;
        readonly modHealth: number;
        readonly modAttack: number;
        refHealth: number;
    };
    export type Event = {
        toAttack: { target: RoleModel };
        onAttack: { target: RoleModel };
        toRecvDamage: DamageProvider
        onRecvDamage: DamageConsumer
        onDie: { death: DeathModel };
    };
    export type Child = {
        readonly effects: EffectModel[];
        readonly death: DeathModel;
        readonly devineSheild: DevineSheildModel;
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
                ...props.state 
            },
            child: { 
                effects: [],
                death: new DeathModel({}),
                devineSheild: new DevineSheildModel({}),
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

    public get route(): Readonly<Partial<{
        parent: Model;
        root: RootModel;
        card: MinionCardModel | HeroCardModel;
        game: GameModel;
        owner: PlayerModel,
        opponent: PlayerModel,
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const card = 
            route.parent instanceof MinionCardModel || 
            route.parent instanceof HeroCardModel ? 
            route.parent : undefined;
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
        this.draft.child.effects.push(effect);
        return effect;
    }

    @TranxUtil.span()
    public startTurn() {
        this.draft.state.action += 1;
    }

    @TranxUtil.span()
    public endTurn() {
        this.draft.state.action = 0;
        // this.draft.state.isRush = false;
    }

    @DebugUtil.log()
    private async toAttack() {
        if (this.state.action <= 0) return;
        const game = this.route.game;
        if (!game) return;
        const candidates = game.query({
            side: this.route.opponent
        });
        if (!candidates.length) return;
        const card = await SelectUtil.get({ candidates })
        const target = card?.child.role;
        if (!target) return;
        const isAbort = this.event.toAttack({ target });
        if (isAbort) return;
        return target;
    }

    @DebugUtil.log()
    public async attack() {
        const target = await this.toAttack();
        if (!target) return;
        if (this.state.action <= 0) return;
        DamageUtil.run([
            {
                target,
                source: this.route.card,
                damage: this.state.curAttack,
                dealDamage: this.state.curAttack,
                isAttack: true,
            },
            { 
                target: this, 
                source: target.route.card, 
                damage: target.state.curAttack,
                dealDamage: target.state.curAttack,
                isAttack: false,
            }
        ])
        this.draft.state.action -= 1;
    }
    
    @DebugUtil.log()
    @TranxUtil.span()
    public recvDamage(req: DamageProvider): DamageConsumer {
        const { damage } = req;
        if (damage <= 0) return {
            ...req,
            recvDamage: 0,
            prevState: { ...this.state },
            nextState: { ...this.state },
            isDevineShield: false,
        }
        const isAbort = this.child.devineSheild.use();
        if (isAbort) return {
            ...req,
            recvDamage: 0,
            prevState: { ...this.state },
            nextState: { ...this.state },
            isDevineShield: true,
        }
        const prevState = { ...this.state };
        this.draft.state.damage += damage;
        const nextState = { ...this.state };
        return {
            ...req,
            recvDamage: damage,
            prevState,
            nextState,
            isDevineShield: false,
        };
    }
    public onDealDamage(res: DamageRes) {
        if (res.mode === DamageMode.ATTACK) {
            this.event.onAttack(res);
        }
    }

    public toRecvDamage(req: DamageReq) {
        this.event.toRecvDamage(req);
    }

    public onRecvDamage(res: DamageRes) {
        this.event.onRecvDamage(res);
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
}