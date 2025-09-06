import { StoreUtil } from "set-piece";
import { MinionModel } from "../models/cards/minion";

export class LibraryUtil {
    private static readonly registry: MinionModel[] = [];

    public static is(code: string) {
        return function (type: new () => MinionModel) {
            const prototype = new type();
            LibraryUtil.registry.push(prototype);
            StoreUtil.is(code)(type);
        }
    }
}