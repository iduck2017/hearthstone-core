import { Constructor, Method, Model } from "set-piece";
import { FeatModel } from "../feats";
import { BattlecryModel } from "../feats/battlecry";
import { Selector } from "../utils/controller";

class FeatSelectorRegistry {
    private map: Map<Constructor<FeatModel>, string[]> = new Map();

    public register(Constructor: Constructor<FeatModel>, key: string) {
        const keys = this.map.get(Constructor) ?? [];
        keys.push(key);
        this.map.set(Constructor, keys);
    }

    public getHooks(feat: FeatModel) {
        let constructor: any = feat.constructor;
        const result: Method<Selector<any>, any[]>[] = [];
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