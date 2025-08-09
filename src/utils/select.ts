import { Callback } from "set-piece";

export type SelectForm<T = any> = {
    list: T[];
    hint?: string;
}

export class SelectUtil {

    private static queue: [SelectForm, Callback][] = [];
    public static get current(): SelectForm | undefined {
        const [selector] = SelectUtil.queue[0] ?? [];
        return selector;
    }
    
    public static set(target: any) {
        const [, resolve] = this.queue.shift() ?? [];
        resolve?.(target);
    }

    private constructor() {}

    public static async get<T>(option: SelectForm<T>): Promise<T | undefined> {
        return new Promise<T>((resolve) => {
            SelectUtil.queue.push([option, resolve]);
        })
    }
}