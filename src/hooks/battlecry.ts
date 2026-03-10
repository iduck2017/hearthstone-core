import { useRoute, useState, Model } from "set-piece";
import { PlayerModel } from "../entities/player";
import { Selector } from "../utils/controller";

export abstract class BattlecryModel<T extends Model = Model> extends Model {
    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    public get player() {
        return this._player;
    }

    @useState()
    private _isPending: boolean = false;
    protected get isPending() {
        return this._isPending;
    }

    @useState()
    private _isMultiTarget: boolean = false;
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

    protected abstract _run(params: Array<T | undefined>): Promise<void>;
    public async run(params: Array<T | undefined>) {
        // toRun
        if (!this.isPending) {
            // Prepare
            this._isPending = true;
        }
        await this._run(params);
    }
}
