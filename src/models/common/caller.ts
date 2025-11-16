import { Model } from "set-piece";

export abstract class CallerModel<
    T extends any[] = any[],
    E extends Model.E = {},
    S extends Model.S = {},
    C extends Model.C = {},
    R extends Model.R = {},
> extends Model<E, S, C, R> {
    public abstract next(...params: T): void;
}