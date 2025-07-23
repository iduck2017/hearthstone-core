import { Callback } from "set-piece";

export type SelectOption<T = any> = {
    candidates: T[];
    hint?: string;
}

export class SelectUtil {

    private static queue: [SelectOption, Callback][] = [];
    public static get current(): SelectOption | undefined {
        const [selector] = SelectUtil.queue[0] ?? [];
        return selector;
    }
    
    public static set(target: any) {
        const [, resolve] = this.queue.shift() ?? [];
        resolve?.(target);
    }

    private constructor() {}

    public static async get<T>(command: SelectOption<T>): Promise<T | undefined> {
        return new Promise<T>((resolve) => {
            SelectUtil.queue.push([command, resolve]);
        })
    }
}