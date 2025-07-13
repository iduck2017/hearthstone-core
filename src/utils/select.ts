import { Callback } from "set-piece";
import { SelectReq } from "../types/request";


export class SelectUtil {

    private static queue: [SelectReq, Callback][] = [];
    public static get current(): SelectReq | undefined {
        const [selector] = SelectUtil.queue[0] ?? [];
        return selector;
    }
    
    public static set(target: any) {
        const [, resolve] = this.queue.shift() ?? [];
        resolve?.(target);
    }

    private constructor() {}

    public static async get<T>(command: SelectReq<T>): Promise<T | undefined> {
        return new Promise<T>((resolve) => {
            SelectUtil.queue.push([command, resolve]);
        })
    }
}