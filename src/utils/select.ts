import { Callback } from "set-piece";

export type SelectQuery<T = any> = {
    candidates: T[];
    hint?: string;
}

export class SelectUtil {

    private static queue: [SelectQuery, Callback][] = [];
    public static get current(): SelectQuery | undefined {
        const [selector] = SelectUtil.queue[0] ?? [];
        return selector;
    }
    
    public static set(target: any) {
        const [, resolve] = this.queue.shift() ?? [];
        resolve?.(target);
    }

    private constructor() {}

    public static async get<T>(command: SelectQuery<T>): Promise<T | undefined> {
        return new Promise<T>((resolve) => {
            SelectUtil.queue.push([command, resolve]);
        })
    }
}