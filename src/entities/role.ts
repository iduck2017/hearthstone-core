import { Model, useChild, useMemo, useRoute, Event, PrevEvent, useEventConsumer, useModel } from "set-piece";
import { TauntModel } from "../rules/taunt";
import { DivineShieldModel } from "../rules/divine-shield";
import { ChargeModel } from "../rules/charge";
import { RushModel } from "../rules/rush";
import { StealthModel } from "../rules/stealth";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";
import { RoleActionModel } from "../rules/role-action";
import { GameModel } from "./game";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { RoleFeatIntf } from "../feats";

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
        this._taunt = props.taunt ?? new TauntModel({ isActived: false });
        this._divineShield = props.divineShield ?? new DivineShieldModel({ isActived: false });
        this._charge = props.charge ?? new ChargeModel({ isActived: false });
        this._rush = props.rush ?? new RushModel({ isActived: false });
        this._stealth = props.stealth ?? new StealthModel({ isActived: false });
    }

    public get name() {
        return `${this.parent?.name}.RoleModel`
    }
    
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

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() { return this._game }

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get minion() { return this._minion }

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useMemo()
    public get entity() {
        return this._minion ?? this._hero;
    }


    public _receiveAttack(options: RoleAttackReceiveOption) {
        const prevEvent = new RoleAttackReceivePrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        options.source.attack.executeLaunch({ target: this });
        const postEvent = new RoleAttackReceiveEvent();
        this.emitAsyncEvent(postEvent);
    }
}

export function useRoleAttackReceivePrevEventConsumer<I extends RoleFeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackReceivePrevEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            const role = that.role;
            const feat = that.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleAttackReceivePrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useRoleAttackReceiveEventConsumer<I extends RoleFeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackReceiveEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            const role = that.role;
            const feat = that.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleAttackReceiveEvent]
        })(prototype, key, descriptor);
    }
}
