import { Method } from "set-piece";

export interface Selector<T = any> {
    readonly options: Readonly<T[]>;
    readonly hint?: string;
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