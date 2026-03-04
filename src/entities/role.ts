import { asChild, asRoute, asTransaction, Model } from "set-piece";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";
import { TauntModel } from "../rules/taunt";
import { DivineShieldModel } from "../rules/divine-shield";
import { ChargeModel } from "../rules/charge";
import { registerDisposer, useDisposer } from "../utils/use-disposer";
import { MinionModel } from "./minion";
import { HeroModel } from "./hero";
import { PlayerModel } from "./player";
import { GameModel } from "./game";
import { Selector } from "../utils/controller";
import { RoleActionModel } from "../rules/role-action";

export interface RoleProps {
    taunt?: TauntModel;
    divineShield?: DivineShieldModel;
    charge?: ChargeModel;
    attack: RoleAttackModel;
    health: RoleHealthModel;
}

export class RoleModel extends Model {
    @asChild()
    private _health: RoleHealthModel;
    public get health() {
        return this._health;
    }

    @asChild()
    private _action: RoleActionModel;
    public get action() {
        return this._action;
    }

    @asChild()
    private _attack: RoleAttackModel;
    public get attack() {
        return this._attack;
    }
    public get isAttackEnabled() {
        const currentPlayer = this._game?.currentPlayer;
        if (this._player !== currentPlayer) return false;
        if (this.action.current <= 0) return false;
        if (this.attack.current <= 0) return false;
        const selector = this.attack.getSelector();
        return !!selector?.options.length;
    }

    @asChild()
    private _taunt: TauntModel;
    public get taunt() {
        return this._taunt;
    }

    @asChild()
    private _divineShield: DivineShieldModel;
    public get divineShield() {
        return this._divineShield;
    }

    @asChild()
    private _charge: ChargeModel;
    public get charge() {
        return this._charge;
    }

    @asRoute(() => MinionModel)
    private _minion?: MinionModel;
    
    @asRoute(() => HeroModel)
    private _hero?: HeroModel;

    private get container() {
        return this._minion ?? this._hero;
    }

    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @asRoute(() => GameModel)
    private _game?: GameModel;

    constructor(props: RoleProps) {
        super();
        this._health = props.health;
        this._attack = props.attack;
        this._action = new RoleActionModel();
        this._taunt = props.taunt ?? new TauntModel();
        this._divineShield = props.divineShield ?? new DivineShieldModel();
        this._charge = props.charge ?? new ChargeModel();
    }

    @useDisposer()
    public receiveDamage(options: {
        value: number;
    }) {
        const disposer = this.container?.disposer;
        if (!disposer) return;
        registerDisposer(disposer);
        if (this._divineShield.consume()) return;
        console.log('Receive damage', options.value);
        this.health.consume(options.value);
    }
    
    /** Attack and receiveAttacl */
    @useDisposer()
    @asTransaction()
    public async attackRole() {
        if (!this.isAttackEnabled) return;

        const target = await this.attack.getTarget();
        if (!target) return;

        if (!this.isAttackEnabled) return;
        this.action.consume();
        this.attack.run({ target })
    }
}