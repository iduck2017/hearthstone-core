import { useRoute, useState, Model, useMemo } from "set-piece";
import { PlayerModel } from "../entities/player";
import { Selector } from "../utils/controller";
import { getBattlecryRunHooks } from "../hooks/battlecry-run";
import { FeatModel } from ".";
import { battlecrySelectorRegistry } from "../hooks/battlecry-selector";

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
    public abstract getSelector(params: Array<T | undefined>): Selector<T> | undefined 

    public async getTargets(): Promise<Array<T | undefined>> {
        if (!this.player) return [];
        const targets: Array<T | undefined> = [];
        while (true) {
            const selector = this.getSelector(targets);
            if (!selector) break;
            const target = await this.player.controller.fetchTarget(selector);
            targets.push(target);
            break;
        }
        return targets;
    }

    /** Target selector */
    // public async getTargets(): Promise<Array<T | undefined>> {
    //     if (!this.player) return [];
    //     const targets: Array<T | undefined> = [];
    //     const hooks = battlecrySelectorRegistry.getHooks(this);
    //     for (const hook of hooks) {
    //         const selector = hook(...targets)
    //         const controller = this.player.controller;
    //         const target = await controller.fetchTarget(selector);
    //         targets.push(target);
    //     }
    //     return targets;
    // }

    public async run(...params: Array<T | undefined>) {
        if (!this.isActived) return;
        if (!this.isPending) this._isPending = true;
        const hooks = getBattlecryRunHooks(this);
        for (const hook of hooks) await hook(...params);
        this._isPending = false;
    }
}
