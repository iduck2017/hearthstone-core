import { asRoute, asState, Model } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";

export type HookRegistry = Array<{ hook: BattlecryModel, params: Array<Model | undefined> }>;

export class HooksLauncherModel extends Model {
    @asState()
    private _registry: HookRegistry;

    @asState()
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
        await currentHook.hook.run(currentHook.params);
        this._currentIndex += 1
        return false;
    }
}