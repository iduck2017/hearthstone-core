import { Callback } from "set-piece";

export class SelectEvent<T = any> {
    public readonly options: T[];
    public readonly hint?: string;

    constructor(
        options: T[],
        hint?: string,
    ) {
        this.options = options;
        this.hint = hint;
    }
}

export class SelectUtil {
    private static queue: [SelectEvent, Callback][] = [];
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