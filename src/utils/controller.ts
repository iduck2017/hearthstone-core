import { Method } from "set-piece";
import { PlayerModel } from "../entities/player";

export class Selector<T = any> {
    private _options: T[];
    public get options(): Readonly<T[]> { 
        return [...this._options];
    }
    public filterOptions(handler: (item: T) => boolean) {
        this._options = this._options.filter(handler);
        return this;
    }

    public hint?: string;
    constructor(
        options: T[],
        config?: {
            hint?: string;
        }
    ) {
        this._options = options;
        this.hint = config?.hint;
    }
}

export class Controller {
    private resolvers: Method<any>[];
    private selectors: Selector[];

    constructor() {
        this.resolvers = [];
        this.selectors = [];
    }

    public fetchTarget<T>(selector: Selector<T>): Promise<T | undefined> {
        if (!selector.options.length) return Promise.resolve(undefined);
        return new Promise<T | undefined>((resolve) => {
            this.selectors.push(selector);
            this.resolvers.push(resolve);
        });
    }

    public selectTarget<T>(target: T | undefined) {
        const selector = this.selectors.shift();
        const resolver = this.resolvers.shift();
        if (!selector) {
            console.log('Selector not found');
            return;
        }
        if (!resolver) {
            console.log('Resolver not found');
            return;
        }
        if (!selector.options.includes(target)) resolver(undefined);
        else resolver(target);
    }
}