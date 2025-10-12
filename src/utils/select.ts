import { Method, Model } from "set-piece";
import { Option } from "../types/option";
import { RoleModel } from "../models/role";
import { CardModel } from "../models/cards";

export class SelectEvent<T = any> {
    public targets: Readonly<T[]>;
    public get options(): Readonly<Option[]> {
        return this.targets.map(item => {
            const name = item instanceof Model ? item.name : String(item);
            const uuid = item instanceof Model ? item.uuid : String(item);
            // return option
            return new Option(
                {
                    title: `Select ${name}`,
                    desc: `${this.desc}: Select ${name}`,
                    code: `select-${uuid}`,
                },
                () => SelectUtil.set(item)
            )
        });
    }

    public readonly hint?: string;
    public readonly desc?: string;

    constructor(
        targets: T[],
        props?: { 
            hint?: string; 
            desc?: string;
        }
    ) {
        this.targets = targets;
        this.hint = props?.hint;
        this.desc = props?.desc;
    }

    public filter(handler: (item: T) => boolean) {
        this.targets = this.targets.filter(handler);
    }

    public get random(): T | undefined {
        const index = Math.floor(Math.random() * this.targets.length);
        return this.targets[index];
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
            if (!option.targets) resolve(undefined);
            SelectUtil.queue.push([option, resolve]);
        })
    }

    private constructor() {}
}