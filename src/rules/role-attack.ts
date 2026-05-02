import { useRoute, useState, Model, useMemo, useRange, useChild, useDecorProducer, useModel, useAction, useEventConsumer, PrevEvent, Event, Decor, useDecorConsumer } from "set-piece";
import { PlayerModel } from "../entities/player";
import { GameModel } from "../entities/game";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { RoleAttackDecor } from "../decors/role-attack";
import { RoleFeatIntf } from "../feats";
import { RoleModel } from "../entities/role";
import { useDisposer } from "../utils/disposer";

export interface RoleAttackOption {
    target: RoleModel;
}
export class RoleAttackEvent extends Event {
    protected _brand: symbol = Symbol('role-attack-perform-event');
}
export class RoleAttackPrevEvent extends PrevEvent<RoleAttackOption> {
    protected _brand: symbol = Symbol('role-attack-perform-prev-event');
}

export class HeroSelectableDecor extends Decor {
    public unlock() { this._result = true; }
}

@useModel('role-attack-model')
export class RoleAttackModel extends Model {
    protected _brand: symbol = Symbol('role-attack-model');

    constructor(props?: {
        origin?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._current = this._origin;
        this._isHeroSelectable = false;
    }

    @useMemo()
    public isEnabled() {
        if (this.current <= 0) return;
        const selector = this.getSelector();
        if (!selector?.options.length) return;
        return true
    }
    
    // Routes
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get minion() { return this._minion }

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;
    @useMemo()
    public get hero() { return this._hero }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() { return this._game }

    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() { return this._role }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    // Origin
    @useRange(0, undefined)
    @useState()
    private _origin: number;
    @useMemo()
    public get origin() { return this._origin }

    // Current
    @useState()
    @useDecorProducer(() => RoleAttackDecor)
    private _current: number;
    @useMemo()
    public get current() { return this._current }

    @useState()
    @useDecorProducer(() => HeroSelectableDecor)
    private _isHeroSelectable: boolean;
    public setHeroSelectable(flag: boolean) {
        this._isHeroSelectable = flag
    }

    public getSelector() {
        const player = this._player;
        const opponent = player?.opponent;
        if (!opponent) return;
        const minions = opponent.board.minions;
        let options = [...minions, opponent.hero].map(item => item.role);
        options = options.filter(role => !role.stealth.isActived);
        if (!this._isHeroSelectable) {
            options = options.filter(role => role !== opponent.hero.role);
        }
        const isBlock = Boolean(options.find(role => role.taunt.isActived))
        if (isBlock) options = options.filter(role => role.taunt.isActived);
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

    @useDisposer()
    public launch(options: RoleAttackOption) {
        const role = this.role;
        if (!role) return
        const prevEvent = new RoleAttackPrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        options.target._receiveAttack({ source: this.role });
        role.stealth.deactive();
        const postEvent = new RoleAttackEvent();
        this.emitAsyncEvent(postEvent);
    }

    // Attack
    @useAction()
    public executeLaunch(options: RoleAttackOption) {
        // Check role
        const role = this.role;
        if (!role) return;
        // Deal damage to each other via damageSource
        const source = role.entity;
        const target = options.target.entity;
        if (!source) return;
        if (!target) return;
        source.damageSource.launch({ 
            target: target.role, 
            value: this._current 
        });
        target.damageSource.launch({ 
            target: role, 
            value: target.role.attack.current 
        });
        // If this is a hero attack, consume weapon durability
        const hero = this._hero
        const weapon = hero?.weapon;
        if (!hero) return;
        if (!weapon) return;
        weapon?.durability.consume();
    }
}

export function useRoleAttackPrevEventConsumer<I extends RoleFeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackPrevEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            const role = that.role;
            const feat = that.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role.attack, RoleAttackPrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useRoleAttackEventConsumer<I extends RoleFeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            const role = that.role;
            const feat = that.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role.attack, RoleAttackEvent]
        })(prototype, key, descriptor);
    }
}
