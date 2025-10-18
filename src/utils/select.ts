import { Method, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { CardModel } from "../models/cards";

export class SelectEvent<T = any> {
    public options: Readonly<T[]>;

    public readonly hint?: string;
    public desc?: string | ((item: T) => string);

    constructor(
        options: T[],
        props?: { 
            hint?: string; 
            desc?: string | ((item: T) => string);
        }
    ) {
        this.options = options;
        this.hint = props?.hint;
        this.desc = props?.desc;
    }

    public filter(handler: (item: T) => boolean) {
        this.options = this.options.filter(handler);
    }
}

export class SelectUtil {
    private static queue: [SelectEvent, Method][] = [];
    public static get current(): SelectEvent | undefined {
        const [selector] = SelectUtil.queue[0] ?? [];
        return selector;
    }
    
    public static set(target: any) {
        const [, resolve] = this.queue.shift() ?? [];
        resolve?.(target);
    }

    public static async get<T>(option: SelectEvent<T>): Promise<T | undefined> {
        return new Promise<T | undefined>((resolve) => {
            if (!option.options) resolve(undefined);
            SelectUtil.queue.push([option, resolve]);
        })
    }

    private constructor() {}
}