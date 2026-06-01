import { useDep, useRoute, useState, Model, useMemo, useRange, useDecorConsumer, useDecorProducer, useModel, Decor } from "set-piece";
import { RoleModel } from "../entities/role";
import { PlayerModel } from "../entities/player";
import type { RoleFeatIntf } from "../feats";
import { GameModel } from "../entities/game";
import { BoardModel } from "../entities/board";
import { HeroModel } from "../heroes";

export interface RoleActionBuff {
    value: number;
    id: string;
}

@useModel('role-action-model')
export class RoleActionModel extends Model {
    protected _brand: symbol = Symbol('role-action-model');

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel

    @useRoute(() => GameModel)
    private _game?: GameModel

    @useRoute(() => BoardModel)
    private _board?: BoardModel

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useMemo()
    public get isEnabled() {
        const currentPlayer = this._game?.currentPlayer;
        const role = this.role;
        const entity = role?.entity;
        if (!role) return;
        if (!entity) return;
        /** Check current turn */
        if (this._player !== currentPlayer) return;
        /** Check action */
        if (this.current <= 0) return;
        if (this.isAsleep) return;
        /** Check freeze */
        if (role.freeze.isActived) return;
        /** Check attack */
        if (!role.attack.isEnabled) return;
        /** Check position — minions must be on a board; heroes are always in play */
        if (!this._board && !this._hero) return;
        /** Check disposer */
        const disposer = entity.disposer;
        if (disposer.isActived) return;
        return true;
    }

    /** Routes */
    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    /** Origin */
    @useState()
    @useDep()
    private _origin: RoleActionBuff[] = [];

    @useMemo()
    public get origin() {
        let result = 1;
        this._origin.forEach(buff => {
            result += buff.value;
        });
        return result;
    }


    /** Current */
    @useState()
    @useRange(0, undefined)
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    public consume() {
        this._current -= 1;
    }

    public resetCurrent() {
        this._current = this.origin;
    }


    /** Sleep */
    @useDecorProducer(() => AsleepDecor)
    @useState()
    private _isAsleep: boolean;
    @useMemo()
    public get isAsleep() { return this._isAsleep }

    public sleep() { this._isAsleep = true }
    public wakeup() { this._isAsleep = false }

    constructor() {
        super();
        this._current = this.origin;
        this._isAsleep = true;
    }

    /** Attack and receiveAttack */
    public async launch() {
        const role = this.role;
        if (!role) return;
        if (!this.isEnabled) return;
        // Get target
        const target = await role.attack.getTarget();
        if (!target) return;
        role.attack.launch({ target })
        this.consume()
    }
}

export class AsleepDecor extends Decor<boolean> {
    private _isLock = false;

    public wakeup() {
        if (this._isLock) return;
        this._result = false
    }

    public sleep() {
        this._isLock = true;
        this._result = true;
    }
}

export function useAsleepDecorConsumer<I extends RoleFeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: AsleepDecor) => void>
    ) {
        useDecorConsumer((that: I) => {
            if (!that.feat?.isActived) return;
            const action = that.role?.action;
            return [action, AsleepDecor]
        })(prototype, key, descriptor);
    }
}
