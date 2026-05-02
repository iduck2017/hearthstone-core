import { Method, useState, Model, useMemo } from "set-piece";
import { FeatModel } from ".";
import { Selector } from "../utils/controller";
import { FeatLauncherRegistry } from "../utils/feat-launcher-registry";
import { FeatSelectorRegistry } from "../utils/feat-selector-registry";

export const spellEffectRunRegistry = new FeatLauncherRegistry();

export function useSpellEffectLaunchHook<T extends Model>() {
    return function(
        prototype: SpellEffectModel<T>,
        key: string,
        _descriptor: TypedPropertyDescriptor<Method<Promise<void>, Array<T | undefined>>>,
    ) {
        const Constructor: any = prototype.constructor;
        spellEffectRunRegistry.register(Constructor, key);
    }
}

export const spellEffectSelectorRegistry = new FeatSelectorRegistry();

export function useSpellEffectSelectHook<T extends Model>() {
    return function(
        prototype: SpellEffectModel<T>,
        key: string,
        _descriptor: TypedPropertyDescriptor<Method<Selector<T> | undefined, Array<T | undefined>>>,
    ) {
        const Constructor: any = prototype.constructor;
        spellEffectSelectorRegistry.register(Constructor, key);
    }
}

export abstract class SpellEffectModel<T extends Model = Model> extends FeatModel {
    @useState()
    private _isPending: boolean = false;
    @useMemo()
    protected get isPending() {
        return this._isPending;
    }

    @useState()
    private _isMultiTarget: boolean = false;
    @useMemo()
    protected get isMultiTarget() {
        return this._isMultiTarget;
    }

    /** Returns itself so SpellFeatureModel consumers can locate the decor producer on subclasses. */
    public get spellEffect() {
        return this;
    }

    constructor(props?: {
        isPending?: boolean;
        isMultiTarget?: boolean;
    }) {
        super();
        this._isPending = props?.isPending ?? false;
        this._isMultiTarget = props?.isMultiTarget ?? false;
    }

    public async getTargets(): Promise<Array<T | undefined>> {
        if (!this.player) return [];
        const targets: Array<T | undefined> = [];
        const hooks = spellEffectSelectorRegistry.getHooks(this);
        for (const hook of hooks) {
            while (true) {
                const selector = hook(...targets);
                if (!selector) break;
                const target = await this.player.controller.fetchTarget(selector);
                targets.push(target);
                if (!this.isMultiTarget) break;
            }
        }
        return targets;
    }

    public async launch(...params: Array<T | undefined>) {
        if (!this.isActived) return;
        if (!this.isPending) this._isPending = true;
        const hooks = spellEffectRunRegistry.getHooks(this);
        for (const hook of hooks) await hook(...params);
        this._isPending = false;
    }
}
