import { MinionCardModel } from "../models/cards/minion";
import { CardModel } from "../models/cards";
import { TemplUtil } from "set-piece";

export class LibraryUtil {
    private static readonly _registry: CardModel[] = [];
    public static get registry(): Readonly<CardModel[]> {
        return [...LibraryUtil._registry];
    }

    public static is(code: string) {
        return function (type: new () => CardModel) {
            const prototype = new type();
            LibraryUtil._registry.push(prototype);
            TemplUtil.is(code)(type);
        }
    }
}