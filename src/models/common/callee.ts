import { Model } from "set-piece";
import { CallerModel } from "./caller";

export namespace CalleeModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R<T extends any[] = any[]> = {
        readonly callers: CallerModel<T>[];
    };
}

export abstract class CalleeModel<
    T extends any[] = any[],
    E extends Partial<CalleeModel.E> & Model.E = {},
    S extends Partial<CalleeModel.S> & Model.S = {},
    C extends Partial<CalleeModel.C> & Model.C = {},
    R extends Partial<CalleeModel.R<T>> & Model.R = {},
> extends Model<
    E & CalleeModel.E, 
    S & CalleeModel.S, 
    C & CalleeModel.C, 
    R & CalleeModel.R<T>
> {
    public promise(caller: CallerModel<T>) {
        this.origin.refer.callers?.push(caller);
    }

    public resolve(...params: T) {
        const caller = this.origin.refer.callers?.pop();
        if (!caller) return;
        caller.next(...params);
    }
}