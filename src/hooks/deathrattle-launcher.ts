import { Method, Model } from "set-piece";
import { DeathrattleModel } from "../feats/deathrattle";
import { FeatLauncherRegistry } from "./battlecry-launcher";

export const deathrattleLauncherRegistry = new FeatLauncherRegistry();

export function useDeathrattleLaunchHook() {
    return function(
        prototype: DeathrattleModel,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<void, []>>,
    ) {
        const Constructor: any = prototype.constructor;
        deathrattleLauncherRegistry.register(Constructor, key)
    }
}

