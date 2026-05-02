import { Event, Model, PrevEvent, useDecorProducer, useEffect, useEventConsumer, useMemo, useRange, useState, useModel, useRoute } from "set-piece";
import { RoleHealthDecor } from "../decors/role-health";
import { registerDisposer, useDisposer } from "../utils/disposer";
import { RoleModel } from "../entities/role";
import type { RoleFeatModel } from "../feats";

export interface RoleDamageReceiveOption {
    value: number;
    source?: Model;
}
export class RoleDamageReceiveEvent extends Event {
    protected _brand: symbol = Symbol('role-damage-receive-event');
}

export class RoleDamageReceivePrevEvent extends PrevEvent<RoleDamageReceiveOption> {
    protected _brand: symbol = Symbol('role-damage-receive-prev-event');
}

@useModel('role-health-model')
export class RoleHealthModel extends Model {
    protected _brand: symbol = Symbol('role-health-model');

    // Origin
    @useState()
    @useRange(0, undefined)
    private _origin: number;
    @useMemo()
    public get origin() {
        return this._origin;
    }

    // Current
    @useState()
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    public setCurrent(value: number) {
        this._current = this._maximum;
    }

    private _prevMaximum?: number;
    @useEffect()
    protected handleMaximumChange() {
        if (this._prevMaximum !== undefined) {
            const offset = this._maximum - this._prevMaximum;
            if (offset === 0)  return;
            console.log(`Handle maximum change: ${this._prevMaximum} -> ${this.maximum}`)
            if (offset > 0) this._current += offset;
            if (offset < 0) this._current = Math.min(this._current, this._maximum);
        }
        this._prevMaximum = this._maximum;
        return;
    }
    
    @useState()
    @useDecorProducer(() => RoleHealthDecor)
    private _maximum: number;
    @useMemo()
    public get maximum() {
        return this._maximum;
    }

    constructor(props?: {
        origin?: number;
        current?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._maximum = props?.origin ?? 1;
        this._current = props?.current ?? this.origin;
    }   


    @useRoute(() => RoleModel)
    private _role?: RoleModel;

    @useDisposer()
    public receiveDamage(options: RoleDamageReceiveOption) {
        // Check disposer
        const role = this._role;
        const entity = role?.entity;
        if (!role) return;
        if (!entity) return;
        const disposer = entity.disposer;
        registerDisposer(disposer);
        // Consume divine shield — no actual damage, event must NOT fire
        if (role.divineShield.isActived) {
            role.divineShield.consume();
            return;
        }
        // Apply damage and fire RoleDamageReceive events
        const prevEvent = new RoleDamageReceivePrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        console.log(this.name, 'Receive damage', options.value);
        this._current -= options.value;
        const postEvent = new RoleDamageReceiveEvent();
        this.emitAsyncEvent(postEvent);
    }

    public receiveRestore(options: {
        value: number;
        source?: Model;
    }) {
        this._current += options.value;
        if (this._current > this._maximum) {
            this._current = this._maximum;
        }
    }
}

export function useDamageReceivePrevEventConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleDamageReceivePrevEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            const role = that.role;
            const feat = that.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role, RoleDamageReceivePrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useDamageReceiveEventConsumer<I extends RoleFeatModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleDamageReceiveEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            const role = that.role;
            const feat = that.feat;
            if (!feat?.isActived) return;
            if (!role) return;
            return [role.health, RoleDamageReceiveEvent]
        })(prototype, key, descriptor);
    }
}
