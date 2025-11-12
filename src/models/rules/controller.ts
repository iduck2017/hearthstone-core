import { Model } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { Selector, SelectorModel } from "./selector";

export namespace ControllerModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {
        factories: SelectorModel[];
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
                factories: [],
                ...props?.refer 
            },
        });
    }

    public bind(factory: SelectorModel): void {
        const selector = factory.selector;
        this.origin.refer.factories?.push(factory);
        this.selectors.push(selector);
        selector.then(() => this.unbind(factory));
    }

    private unbind(factory: SelectorModel): void {
        const index = this.origin.refer.factories?.indexOf(factory);
        if (index === undefined) return;
        if (index === -1) return;
        this.origin.refer.factories?.splice(index, 1);
    }

    public get<T>(selector: Selector<T>): Promise<T | undefined> {
        if (!selector.options.length) return Promise.resolve(undefined);
        this.selectors.push(selector);
        return new Promise<T | undefined>((resolve) => {
            selector.then(resolve);
        });
    }

    public set<T>(target: T | undefined) {
        const selector = this.selectors.shift();
        if (!selector) return;
        if (!selector.options.includes(target)) selector.emit(undefined);
        selector.emit(target);
    }
}