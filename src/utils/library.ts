import { StoreUtil } from "set-piece";
import { MinionCardModel } from "../models/cards/minion";
import { CardModel } from "../models/cards";

export class LibraryUtil {
    private static readonly registry: CardModel[] = [];

    public static is(code: string) {
        return function (type: new () => CardModel) {
            const prototype = new type();
            LibraryUtil.registry.push(prototype);
            StoreUtil.is(code)(type);
        }
    }
}