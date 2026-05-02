import { Method, Model } from "set-piece";
import { BattlecryModel } from "../feats/battlecry";
import { Selector } from "../utils/controller";
import { FeatSelectorRegistry } from "../utils/feat-selector-registry";

export const battlecrySelectorRegistry = new FeatSelectorRegistry();

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