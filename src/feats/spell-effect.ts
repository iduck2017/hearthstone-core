import { useState, Model, useMemo } from "set-piece";
import { getSpellEffectRunHooks } from "../hooks/spell-effect-run";
import { FeatModel } from ".";
import { Selector } from "../utils/controller";

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
        const hooks = getSpellEffectRunHooks(this);
        for (const hook of hooks) {
            await hook(...params);
        }
    }
}
