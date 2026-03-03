import { asRoute, asState, Model } from "set-piece";
import { PlayerModel } from "../entities/player";
import { Selector } from "../utils/controller";

export abstract class BattlecryModel<T extends Model = Model> extends Model {
    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;
    public get player() {
        return this._player;
    }

    @asState()
    private _isPending: boolean = false;
    protected get isPending() {
        return this._isPending;
    }

    @asState()
    private _isMultiSelect: boolean = false;
    protected get isMultiSelect() {
        return this._isMultiSelect;
    }

    constructor(props?: {
        isPending?: boolean;
        isMultiSelect?: boolean;
    }) {
        super();
        this._isPending = props?.isPending ?? false;
        this._isMultiSelect = props?.isMultiSelect ?? false;
    }
    
    /** Target selector */
    public abstract getSelector(params: Array<T | undefined>): Selector<T> | undefined 
    public async fetchParams(): Promise<Array<T | undefined>> {
        if (!this.player) return [];
        
        const params: Array<T | undefined> = [];
        while (true) {
            const selector = this.getSelector(params);
            if (!selector) break;
            const target = await this.player.controller.fetchTarget(selector);
            params.push(target);
            if (!this.isMultiSelect) break;
        }
        return params;
    }

    protected abstract _run(params: Array<T | undefined>): Promise<void>;
    public async run(params: Array<T | undefined>) {
        // toRun
        if (!this.isPending) {
            /** prepare */
            this._isPending = true;
        }
        await this._run(params);
    }
}
