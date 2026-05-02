import { Constructor, Method, Model } from "set-piece";
import { BattlecryModel } from "../feats/battlecry";
import { FeatModel } from "../feats";

export class FeatLauncherRegistry<P extends any[]> {
    private map: Map<Constructor<FeatModel>, string[]> = new Map();

    public register(Constructor: Constructor<FeatModel>, key: string) {
        const keys = this.map.get(Constructor) ?? [];
        keys.push(key);
        this.map.set(Constructor, keys);
    }

    public getHooks(feat: FeatModel) {
        let constructor: any = feat.constructor;
        const result: Method<void, P>[] = [];
        while (constructor) {
            const keys = this.map.get(constructor) ?? [];
            keys.forEach(key => {
                const method = Reflect.get(feat, key);
                if (!(method instanceof Function)) return;
                result.push(method.bind(feat));
            })
            constructor = Object.getPrototypeOf(constructor);
        }
        return result;
    }
}

export const battlecryLauncherRegistry = new FeatLauncherRegistry()

export function useBattlecryLaunchHook<T extends Model>() {
    return function(
        prototype: BattlecryModel<T>,
        key: string,
        descriptor: TypedPropertyDescriptor<Method<Promise<void>, Array<T | undefined>>>,
    ) {
        const Constructor: any = prototype.constructor;
        battlecryLauncherRegistry.register(Constructor, key)
    }
}
