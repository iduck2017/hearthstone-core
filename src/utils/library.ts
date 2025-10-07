import { StoreUtil } from "set-piece";
import { MinionCardModel } from "../models/cards/minion";
import { CardModel } from "../models/cards";

export class LibraryUtil {
    private static readonly _registry: CardModel[] = [];
    public static get registry(): Readonly<CardModel[]> {
        return [...LibraryUtil._registry];
    }

    public static is(code: string) {
        return function (type: new () => CardModel) {
            const prototype = new type();
            LibraryUtil._registry.push(prototype);
            StoreUtil.is(code)(type);
        }
    }
}