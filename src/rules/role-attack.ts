import { asChildList, asDependency, asRoute, asState, Model, useMemory, useRange } from "set-piece";
import { RoleModel } from "../entities/role";
import { PlayerModel } from "../entities/player";
import { NumberDecorModel } from "../utils/decor";
import { MinionModel } from "../entities/minion";
import { HeroModel } from "../entities/hero";
import { GameModel } from "../entities/game";

export class RoleAttackModel extends Model {
    constructor(props?: {
        origin?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._current = [];
    }


    // Routes
    @asRoute(() => MinionModel)
    private _minion?: MinionModel;
    public get minion() {
        return this._minion;
    }

    @asRoute(() => HeroModel)
    private _hero?: HeroModel;
    public get hero() {
        return this._hero;
    }

    @asRoute(() => GameModel)
    private _game?: GameModel;
    public get game() {
        return this._game;
    }

    @asRoute(() => RoleModel)
    private _role?: RoleModel;
    public get role() {
        return this._role;
    }

    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;

    // Origin
    @useRange(0, undefined)
    @asState()
    @asDependency()
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    // Current
    @asChildList()
    @asDependency(true)
    private _current: NumberDecorModel[];

    @useMemory()
    @useRange(0, undefined)
    public get current() {
        let result = this._origin;
        this._current?.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    public addDecor(decor: NumberDecorModel) {
        this._current.push(decor);
    }

    public removeDecor(decor: NumberDecorModel) {
        const index = this._current.indexOf(decor);
        if (index !== -1) {
            this._current.splice(index, 1);
        }
    }


    private get isOpponentHeroSelectable() {
        const minion = this.minion;
        if (!minion) return false;
        const role = this.role;
        if (!role) return false;
        if (role.charge.isActived) return true;

        const game = this.game;
        if (!game) return false;
        const summonTurn = minion.summonedTurn;
        const currentTurn = game.turn;
        if (summonTurn !== currentTurn) return true;
        return false;
    }

    public getSelector() {
        const player = this._player;
        const opponent = player?.opponent;
        if (!opponent) return;
        
        const minions = opponent.board.minions;
        let options = [...minions, opponent.hero].map(item => item.role);
        options = options.filter(role => !role.stealth.isActived);
        if (!this.isOpponentHeroSelectable) {
            options = options.filter(role => role !== opponent.hero.role);
        }
        if (options.find(role => role.taunt.isActived)) {
            options = options.filter(role => role.taunt.isActived);
        }
        return { options }
    }

    public async getTarget() {
        // Get player
        const player = this._player;
        if (!player) return;
        // Get selector
        const selector = this.getSelector();
        if (!selector) return;
        // Get target
        const target = await player.controller.fetchTarget(selector);
        if (!target) return;
        return target
    }


    // Attack
    public run(options: {
        target: RoleModel;
    }) {
        // Check role
        const role = this.role;
        if (!role) return;
        // Deal damage to each other
        const { target } = options;
        role.receiveDamage({ value: target.attack.current })
        target.receiveDamage({ value: this.current })
    }
}