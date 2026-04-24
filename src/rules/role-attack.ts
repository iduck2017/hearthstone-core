import { useDep, useRoute, useState, Model, useMemo, useRange, useChild, useDecorProducer, useConsoleGroup } from "set-piece";
import { RoleModel } from "../../src/entities/role";
import { PlayerModel } from "../entities/player";
import { GameModel } from "../entities/game";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { RoleAttackDecor } from "../decors/role-attack";

export class RoleAttackModel extends Model {
    constructor(props?: {
        origin?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._current = this._origin;
        this.init();
    }

    // Routes
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get minion() {
        return this._minion;
    }

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;
    @useMemo()
    public get hero() {
        return this._hero;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() {
        return this._game;
    }

    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    // Origin
    @useRange(0, undefined)
    @useState()
    private _origin: number;
    @useMemo()
    public get origin() {
        return this._origin;
    }

    // Current
    @useState()
    @useDecorProducer(() => RoleAttackDecor)
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    @useMemo()
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
        // Deal damage to each other via damageSource
        const { target } = options;
        role.dealDamage({ target, value: this._current });
        target.dealDamage({ target: role, value: target.attack._current });
    }
}