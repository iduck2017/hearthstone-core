import { Method } from "set-piece";
import { PlayerModel } from "../models/entities/player";
import { Selector } from "./selector";

export class Controller {
    public readonly player: PlayerModel;

    private resolvers: Method[];

    private selectors: Selector[];
    public get current() {
        return this.selectors[0];
    }

    constructor(player: PlayerModel) {
        this.player = player;
        this.resolvers = [];
        this.selectors = [];
    }

    public get<T>(selector: Selector<T>): Promise<T | undefined> {
        if (!selector.options.length) return Promise.resolve(undefined);
        return new Promise<T | undefined>((resolve) => {
            this.selectors.push(selector);
            this.resolvers.push(resolve);
        });
    }

    public set<T>(target: T | undefined) {
        const selector = this.selectors.shift();
        const resolver = this.resolvers.shift();
        if (!selector) return;
        if (!resolver) return;
        if (!selector.options.includes(target)) resolver(undefined);
        else resolver(target);
    }
}