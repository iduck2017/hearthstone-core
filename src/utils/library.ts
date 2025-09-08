import { StoreUtil } from "set-piece";
import { MinionCardModel } from "../models/cards/minion";

export class LibraryUtil {
    private static readonly registry: MinionCardModel[] = [];

    public static is(code: string) {
        return function (type: new () => MinionCardModel) {
            const prototype = new type();
            LibraryUtil.registry.push(prototype);
            StoreUtil.is(code)(type);
        }
    }
}