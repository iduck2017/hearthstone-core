import { Model } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { Selector, SelectorModel } from "./selector";

export namespace ControllerModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {
        selectors: SelectorModel[];
    }
}

export class ControllerModel extends Model<
    ControllerModel.E,
    ControllerModel.S,
    ControllerModel.C,
    ControllerModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            game: result.items.find(item => item instanceof GameModel),
            player: result.items.find(item => item instanceof PlayerModel),
        }
    }

    private selectors: Selector[] = [];
    public get current() {
        return this.selectors[0];
    }
    constructor(props?: ControllerModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { 
                selectors: [],
                ...props?.refer 
            },
        });
    }

    public get<T>(param: Selector<T> | SelectorModel<T>): Promise<T | undefined> {
        if (param instanceof SelectorModel) {
            this.origin.refer.selectors?.push(param);
            return this.get(param.selector);
        }
        if (!param.options.length) return Promise.resolve(undefined);
        this.selectors.push(param);
        return new Promise<T | undefined>((resolve) => {
            param.then(resolve);
        });
    }

    public set<T>(target: T) {
        const selector = this.selectors.shift();
        if (!selector) return;
        if (!selector.options.includes(target)) return;
        selector.emit(target);
    }
}