import { Constructor, Method, useRoute, useState, Model, useMemo } from "set-piece";
import { PlayerModel } from "../entities/player";
import { Selector } from "../utils/controller";
import { FeatModel } from ".";
import { FeatLauncherRegistry } from "../utils/feat-launcher-registry";
import { FeatSelectorRegistry } from "../utils/feat-selector-registry";

export const battlecryLauncherRegistry = new FeatLauncherRegistry()
export const battlecrySelectorRegistry = new FeatSelectorRegistry();

export function useBattlecryLaunchHook<T extends Model>() {
    return function(
        prototype: BattlecryModel<T>,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<Promise<void>, Array<T | undefined>>>,
    ) {
        const Constructor: any = prototype.constructor;
        battlecryLauncherRegistry.register(Constructor, key)
    }
}


export function useBattlecrySelectHook<T extends Model>() {
    return function(
        prototype: BattlecryModel<T>,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<Selector<T> | undefined, Array<T | undefined>>>,
    ) {
        const Constructor: any = prototype.constructor
        battlecrySelectorRegistry.register(Constructor, key);
    }
}

export abstract class BattlecryModel<T extends Model = Model> extends FeatModel {
    @useState()
    private _isPending: boolean = false;
    @useMemo()
    protected get isPending() {
        return this._isPending;
    }

    constructor(props?: {
        isPending?: boolean;
    }) {
        super();
        this._isPending = props?.isPending ?? false;
    }

    /** Target selector */
    public async getTargets(): Promise<Array<T | undefined>> {
        if (!this.player) return [];
        const targets: Array<T | undefined> = [];
        const hooks = battlecrySelectorRegistry.getHooks(this);
        for (const hook of hooks) {
            const selector = hook(...targets)
            const controller = this.player.controller;
            const target = await controller.fetchTarget(selector);
            targets.push(target);
        }
        return targets;
    }

    public async launch(...params: Array<T | undefined>) {
        if (!this.isActived) return;
        if (!this.isPending) this._isPending = true;
        const hooks = battlecryLauncherRegistry.getHooks(this);
        for (const hook of hooks) await hook(...params);
        this._isPending = false;
    }
}
