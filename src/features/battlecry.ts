import { useRoute, useState, Model, useMemo } from "set-piece";
import { PlayerModel } from "../entities/player";
import { Selector } from "../utils/controller";
import { getBattlecryRunHooks } from "../hooks/battlecry-run";
import { FeatureModel } from ".";

export abstract class BattlecryModel<T extends Model = Model> extends FeatureModel {
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

    constructor(props?: {
        isPending?: boolean;
        isMultiTarget?: boolean;
    }) {
        super();
        this._isPending = props?.isPending ?? false;
        this._isMultiTarget = props?.isMultiTarget ?? false;
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
            if (!this.isMultiTarget) break;
        }
        return targets;
    }

    public async run(...params: Array<T | undefined>) {
        if (!this.isActived) return;
        if (!this.isPending) {
            this._isPending = true;
        }
        const hooks = getBattlecryRunHooks(this);
        for (const hook of hooks) {
            await hook(...params);
        }
    }
}
