import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { EffectModel } from "./feature/effect";
import { RootModel } from "./root";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { CardModel } from "./card";
import { SelectUtil } from "../utils/select";
import { DamageUtil } from "../utils/damage";
import { DamageMode } from "../types/enums";
import { DamageReq, DamageRes } from "../types/request";

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
        toRecvDamage: DamageReq
        onRecvDamage: DamageRes
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
                mode: DamageMode.ATTACK
            },
            { 
                target: this, 
                source: target.route.card, 
                damage: target.state.curAttack,
                dealDamage: target.state.curAttack,
                mode: DamageMode.DEFEND
            }
        ])
        this.draft.state.action -= 1;
    }
    
    @DebugUtil.log()
    @TranxUtil.span()
    public recvDamage(req: DamageReq): DamageRes {
        const { dealDamage } = req;
        // if (this.state.isShield) {
        //     this.draft.state.isShield = false;
        //     return 0
        // }
        const prevState = { ...this.state };
        this.draft.state.damage += dealDamage;
        const nextState = { ...this.state };
        // if (this.state.curHealth <= 0) {
        //     this.draft.state.isDead = true;
        // }
        return {
            ...req,
            recvDamage: dealDamage,
            prevState,
            nextState,
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