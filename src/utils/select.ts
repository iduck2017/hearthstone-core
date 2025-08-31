import { Func } from "set-piece";

export class SelectEvent<T = any> {
    public options: T[];
    public readonly hint?: string;

    constructor(
        options: T[],
        props?: {
            hint?: string;
        }
    ) {
        this.options = options;
        this.hint = props?.hint;
    }

    public get random(): T | undefined {
        const index = Math.floor(Math.random() * this.options.length);
        return this.options[index];
    }
}

export class SelectUtil {
    private static queue: [SelectEvent, Func][] = [];
    public static get current(): SelectEvent | undefined {
        const [selector] = SelectUtil.queue[0] ?? [];
        return selector;
    }
    
    public static set(target: any) {
        const [, resolve] = this.queue.shift() ?? [];
        resolve?.(target);
    }

    private constructor() {}

    public static async get<T>(option: SelectEvent<T>): Promise<T | undefined> {
        return new Promise<T | undefined>((resolve) => {
            if (!option.options) resolve(undefined);
            SelectUtil.queue.push([option, resolve]);
        })
    }
}