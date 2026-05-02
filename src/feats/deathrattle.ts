import { Method, useModel } from "set-piece";
import { FeatModel } from ".";
import { FeatLauncherRegistry } from "../utils/feat-launcher-registry";

export const deathrattleLauncherRegistry = new FeatLauncherRegistry();

export function useDeathrattleLaunchHook() {
    return function(
        prototype: DeathrattleModel,
        key: string,
        _descriptor: TypedPropertyDescriptor<Method<void, []>>,
    ) {
        const Constructor: any = prototype.constructor;
        deathrattleLauncherRegistry.register(Constructor, key)
    }
}

@useModel('deathrattle-model')
export class DeathrattleModel extends FeatModel {
    protected _brand: symbol = Symbol('deathrattle-model');
    public run() {
        if (!this.isActived) return;
        const hooks = deathrattleLauncherRegistry.getHooks(this);
        for (const hook of hooks) hook();
    }
}