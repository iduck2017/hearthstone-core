import { Method } from "set-piece";

export interface Selector<T> {
    readonly options: Readonly<T[]>;
    readonly hint?: string;
}

export class Controller {
    private _resolvers: Method<any>[];

    private _selectors: Selector<any>[];
    public get selector() {
        return this._selectors[0];
    }

    constructor() {
        this._resolvers = [];
        this._selectors = [];
    }

    public fetchTarget<T>(selector: Selector<T>): Promise<T | undefined> {
        if (!selector.options.length) return Promise.resolve(undefined);
        return new Promise<T | undefined>((resolve) => {
            this._selectors.push(selector);
            this._resolvers.push(resolve);
        });
    }

    public selectTarget<T>(target: T | undefined) {
        const selector = this._selectors.shift();
        const resolver = this._resolvers.shift();
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