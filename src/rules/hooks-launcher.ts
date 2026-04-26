import { useRoute, useState, Model, useModel } from "set-piece";
import { BattlecryModel } from "../feats/battlecry";
import { SpellEffectModel } from "../feats/spell-effect";

export type HookRegistry = Array<{ hook: BattlecryModel | SpellEffectModel, params: Array<Model | undefined> }>;

@useModel('hooks-launcher-model')
export class HooksLauncherModel extends Model {
    protected _brand: symbol = Symbol('hooks-launcher-model');
    @useState()
    private _registry: HookRegistry;

    @useState()
    private _currentIndex: number;
    
    constructor(props: {
        registry: HookRegistry;
    }) {
        super();
        this._registry = props.registry;
        this._currentIndex = 0;
        
    }

    public async next(): Promise<boolean> {
        if (!this._registry) return false;

        const currentHook = this._registry[this._currentIndex];
        if (!currentHook) return true;
        /** Run hooks */
        await currentHook.hook.run(...currentHook.params);
        this._currentIndex += 1
        return false;
    }
}