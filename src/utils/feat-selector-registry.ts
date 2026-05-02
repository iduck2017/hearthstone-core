import { Constructor, Method } from "set-piece";
import { FeatModel } from "../feats";
import { Selector } from "./controller";

export class FeatSelectorRegistry {
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
