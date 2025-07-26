import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { EffectModel } from "../effect";
import { RootModel } from "../root";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { SelectUtil } from "../../utils/select";
import { DevineSheildModel } from "../devine-sheild";
import { DeathModel } from "./death";
import { MinionCardModel } from "../card/minion";
import { DamageCmd, DamageType, DamageModel } from "../damage";
import { HeroModel } from "../hero";
import { FilterType } from "../../types";
import { BoardModel } from "../board";
import { HandModel } from "../hand";
import { DeckModel } from "../deck";

export type CheckOption = {
    isAlive?: FilterType;
    onBoard?: FilterType;
    onHand?: FilterType;
    onDeck?: FilterType;
}

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
        toAttack: { target: RoleModel, isAbort: boolean };
        onAttack: { target: RoleModel };
        toRecvDamage: DamageCmd
        onRecvDamage: DamageCmd
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


    public check(options: CheckOption) {
        const { isAlive, onBoard, onHand, onDeck } = options;
        const flag =   
            this._check(isAlive, this.child.death.state.isDead) &&
            this._check(onBoard, this.route.parent instanceof BoardModel) &&
            this._check(onHand, this.route.parent instanceof HandModel) &&
            this._check(onDeck, this.route.parent instanceof DeckModel)
        return flag;
    }

    private _check(mode: FilterType | undefined, flag: boolean) {
        if (mode === FilterType.INCLUDE && !flag) return false;
        if (mode === FilterType.EXCLUDE && flag) return false;
        return true;
    }

    public get route(): Model['route'] & Readonly<Partial<{
        card: MinionCardModel;
        hero: HeroModel;
        game: GameModel;
        damage: DamageModel;
        owner: PlayerModel,
        opponent: PlayerModel,
    }>> {
        const { parent, root } = super.route;
        const card = parent instanceof MinionCardModel ? parent : undefined;
        const hero = parent instanceof HeroModel ? parent : undefined;
        const opponent = card?.route.opponent;
        const game = root instanceof RootModel ? root.child.game : undefined;
        const damage = hero?.child.damage ?? card?.child.damage;
        const owner = card?.route.owner ?? hero?.route.owner;
        return {
            ...super.route,
            game,
            card,
            hero,
            owner,
            opponent,
            damage,
        }
    }

    public affect(effect: EffectModel) {
        this.draft.child.effects.push(effect);
        return effect;
    }

    public startTurn() {
        this.resetAction();
    }

    private resetAction() {
        this.draft.state.action = 1 + bonus;
    }

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
        const role = await SelectUtil.get({ candidates })
        if (!role) return;
        const signal = this.event.toAttack({ target: role, isAbort: false });
        if (signal?.isAbort) return;
        return role;
    }

    @DebugUtil.log()
    public async attack() {
        const target = await this.toAttack();
        if (!this.route.damage) return;
        if (!target?.route.damage) return;
        if (this.state.action <= 0) return;
        this.draft.state.action -= 1;
        DamageModel.dealDamage([
            {
                target,
                source: this.route.damage,
                damage: this.state.curAttack,
                result: this.state.curAttack,
                type: DamageType.ATTACK,
            },
            { 
                target: this, 
                source: target.route.damage, 
                damage: target.state.curAttack,
                result: target.state.curAttack,
                type: DamageType.DEFEND,
            }
        ])
        this.event.onAttack({ target });
    }

    public toRecvDamage(cmd: DamageCmd): DamageCmd | void {
        return this.event.toRecvDamage(cmd);
    }
    
    @DebugUtil.log()
    public recvDamage(cmd: DamageCmd): DamageCmd {
        const { result } = cmd;
        if (result <= 0) return { ...cmd, result: 0 }
        const isSheild = this.child.devineSheild.check(cmd);
        if (isSheild) return { ...cmd, result: 0 }
        this.draft.state.damage += result;
        this.onRecvDamage(cmd);
        return { ...cmd, result };
    }

    private onRecvDamage(cmd: DamageCmd) {
        this.child.death.check(cmd);
        this.event.onRecvDamage(cmd);
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