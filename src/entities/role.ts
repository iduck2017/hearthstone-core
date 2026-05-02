import { Model, useChild, useMemo, useRoute, useAction, Event, PrevEvent, useEventConsumer, useModel } from "set-piece";
import { TauntModel } from "../rules/taunt";
import { DivineShieldModel } from "../rules/divine-shield";
import { ChargeModel } from "../rules/charge";
import { RushModel } from "../rules/rush";
import { StealthModel } from "../rules/stealth";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";
import { BoardModel } from "./board";
import { RoleActionModel } from "../rules/role-action";
import { PlayerModel } from "./player";
import { GameModel } from "./game";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { registerDisposer, useDisposer } from "../utils/disposer";
import { BaseFeatModel, RoleFeatModel } from "../feats";

export interface RoleAttackPerformOption {
    target: RoleModel;
}
export class RoleAttackPerformEvent extends Event {
    protected _brand: symbol = Symbol('role-attack-perform-event');
}
export class RoleAttackPerformPrevEvent extends PrevEvent<RoleAttackPerformOption> {
    protected _brand: symbol = Symbol('role-attack-perform-prev-event');
}

export interface RoleAttackReceiveOption {
    source: RoleModel;
}
export class RoleAttackReceiveEvent extends Event {
    protected _brand: symbol = Symbol('role-attack-receive-event');
}
export class RoleAttackReceivePrevEvent extends PrevEvent<RoleAttackReceiveOption> {
    protected _brand: symbol = Symbol('role-attack-receive-prev-event');
}

export interface RoleProps {
    taunt?: TauntModel;
    divineShield?: DivineShieldModel;
    charge?: ChargeModel;
    rush?: RushModel;
    stealth?: StealthModel;
    attack: RoleAttackModel;
    health: RoleHealthModel;
}

@useModel('role-model')
export class RoleModel extends Model {
    protected _brand = Symbol('role-model');

    constructor(props: RoleProps) {
        super();
        this._health = props.health;
        this._attack = props.attack;
        this._action = new RoleActionModel();
        this._taunt = props.taunt ?? new TauntModel();
        this._divineShield = props.divineShield ?? new DivineShieldModel();
        this._charge = props.charge ?? new ChargeModel();
        this._rush = props.rush ?? new RushModel();
        this._stealth = props.stealth ?? new StealthModel();
    }

    public get name() {
        return `${this.parent?.name}.RoleModel`
    }

    @useRoute(() => BoardModel)
    private _board?: BoardModel;

    @useChild()
    private _health: RoleHealthModel;
    @useMemo()
    public get health() {
        return this._health;
    }

    @useChild()
    private _action: RoleActionModel;
    @useMemo()
    public get action() {
        return this._action;
    }

    @useChild()
    private _attack: RoleAttackModel;
    @useMemo()
    public get attack() {
        return this._attack;
    }

    @useMemo()
    public get isAttackEnabled() {
        const currentPlayer = this._game?.currentPlayer;
        /** Check current turn */
        if (this._player !== currentPlayer) return false;
        /** Check action */
        if (!this.action.isEnable) return false;
        /** Check attack */
        if (this.attack.current <= 0) return false;
        /** Check position — minions must be on a board; heroes are always in play */
        if (!this._board && !this._hero) return false;
        /** Check disposer */
        if (!this.entity) return false;
        if (this.entity.disposer.isActived) return false;
        const selector = this.attack.getSelector();
        return !!selector?.options.length;
    }

    @useChild()
    private _taunt: TauntModel;
    @useMemo()
    public get taunt() {
        return this._taunt;
    }

    @useChild()
    private _divineShield: DivineShieldModel;
    @useMemo()
    public get divineShield() {
        return this._divineShield;
    }

    @useChild()
    private _charge: ChargeModel;
    @useMemo()
    public get charge() {
        return this._charge;
    }

    @useChild()
    private _rush: RushModel;
    @useMemo()
    public get rush() {
        return this._rush;
    }

    @useChild()
    private _stealth: StealthModel;
    @useMemo()
    public get stealth() {
        return this._stealth;
    }

    // Route
    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() {
        return this._game;
    }

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useMemo()
    public get entity() {
        return this._minion ?? this._hero;
    }

    /** Attack and receiveAttack */
    @useDisposer()
    @useAction()
    public async runAttack() {
        if (!this.isAttackEnabled) return;
        // Get target
        const target = await this.attack.getTarget();
        if (!target) return;
        if (!this.isAttackEnabled) return;
        this._executeAttack({ target })
    }

    private _executeAttack(options: RoleAttackPerformOption) {
        const prevEvent = new RoleAttackPerformPrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        this.action.consumeCurrent();
        options.target._receiveAttack({ source: this });
        this._stealth.deactive();
        const postEvent = new RoleAttackPerformEvent();
        this.emitAsyncEvent(postEvent);
    }

    private _receiveAttack(options: RoleAttackReceiveOption) {
        const prevEvent = new RoleAttackReceivePrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        options.source.attack.launch({ target: this });
        const postEvent = new RoleAttackReceiveEvent();
        this.emitAsyncEvent(postEvent);
    }
}

export function useRoleAttackPerformPrevEventConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackPerformPrevEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const role = self.role;
            const feat = self.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleAttackPerformPrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useRoleAttackPerformEventConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackPerformEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const role = self.role;
            const feat = self.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleAttackPerformEvent]
        })(prototype, key, descriptor);
    }
}

export function useRoleAttackReceivePrevEventConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackReceivePrevEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const role = self.role;
            const feat = self.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleAttackReceivePrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useRoleAttackReceiveEventConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackReceiveEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const role = self.role;
            const feat = self.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleAttackReceiveEvent]
        })(prototype, key, descriptor);
    }
}
