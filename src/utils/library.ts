import { MinionCardModel } from "../models/entities/cards/minion";
import { CardModel } from "../models/entities/cards";
import { TemplUtil } from "set-piece";

export class LibraryUtil {

    private static readonly _cards: CardModel[] = [];
    public static get cards(): Readonly<CardModel[]> {
        return [...LibraryUtil._cards];
    }

    public static is(code: string) {
        return function (type: new () => CardModel) {
            const prototype = new type();
            LibraryUtil._cards.push(prototype);
            TemplUtil.is(code)(type);
        }
    }
}