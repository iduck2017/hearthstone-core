import { useChild, useChildList, useRoute, useTrx, Model } from "set-piece";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";
import { TauntModel } from "../rules/taunt";
import { DivineShieldModel } from "../rules/divine-shield";
import { ChargeModel } from "../rules/charge";
import { RushModel } from "../rules/rush";
import { StealthModel } from "../rules/stealth";
import { registerDisposer, useDisposer } from "../utils/use-disposer";
import { MinionModel } from "./minion";
import { HeroModel } from "./hero";
import { PlayerModel } from "./player";
import { GameModel } from "./game";
import { Selector } from "../utils/controller";
import { RoleActionModel } from "../rules/role-action";
import { CardModel } from "../cards";
import { BoardModel } from "./board";

export interface RoleProps {
    taunt?: TauntModel;
    divineShield?: DivineShieldModel;
    charge?: ChargeModel;
    rush?: RushModel;
    stealth?: StealthModel;
    attack: RoleAttackModel;
    health: RoleHealthModel;
}


export class RoleModel extends Model {

    @useRoute(() => BoardModel)
    private _board?: BoardModel;

    @useChild()
    private _health: RoleHealthModel;
    public get health() {
        return this._health;
    }

    @useChild()
    private _action: RoleActionModel;
    public get action() {
        return this._action;
    }

    @useChild()
    private _attack: RoleAttackModel;
    public get attack() {
        return this._attack;
    }
    public get isAttackEnabled() {
        const currentPlayer = this._game?.currentPlayer;
        /** Check current turn */
        if (this._player !== currentPlayer) return false;
        /** Check action */
        if (!this.action.isEnable) return false;
        /** Check attack */
        if (this.attack.current <= 0) return false;
        /** Check position */
        if (!this._board) return false;
        /** Check disposer */
        if (!this.container) return false;
        if (this.container.disposer.isActived) return false;
        const selector = this.attack.getSelector();
        return !!selector?.options.length;
    }

    @useChild()
    private _taunt: TauntModel;
    public get taunt() {
        return this._taunt;
    }

    @useChild()
    private _divineShield: DivineShieldModel;
    public get divineShield() {
        return this._divineShield;
    }

    @useChild()
    private _charge: ChargeModel;
    public get charge() {
        return this._charge;
    }

    @useChild()
    private _rush: RushModel;
    public get rush() {
        return this._rush;
    }

    @useChild()
    private _stealth: StealthModel;
    public get stealth() {
        return this._stealth;
    }

    // Route
    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useRoute(() => GameModel)
    private _game?: GameModel;
    public get game() {
        return this._game;
    }

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    
    @useRoute(() => HeroModel)
    private _hero?: HeroModel;


    public get container() {
        return this._minion ?? this._hero;
    }

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

    @useDisposer()
    public receiveDamage(options: {
        value: number;
    }) {
        // Check disposer
        const disposer = this.container?.disposer;
        if (!disposer) return;
        registerDisposer(disposer);
        // Consume divine shield
        if (this._divineShield.isActived) {
            this._divineShield.consume();
            return;
        }
        // Consume health
        console.log('Receive damage', options.value);
        this.health.consumeCurrent(options.value);
    }
    
    /** Attack and receiveAttacl */
    @useDisposer()
    @useTrx()
    public async runAttack() {
        if (!this.isAttackEnabled) return;
        // Get target
        const target = await this.attack.getTarget();
        if (!target) return;
        if (!this.isAttackEnabled) return;
        // Consume action
        this.action.consumeCurrent();
        // Run attack
        this.attack.run({ target });
        // Deactive stealth
        this._stealth.deactive();
    }
}