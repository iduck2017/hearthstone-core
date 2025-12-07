import { MinionCardModel } from "../models/entities/cards/minion";
import { CardModel } from "../models/entities/cards";
import { ChunkService } from "set-piece";

export class LibraryService {

    private static readonly _cards: CardModel[] = [];
    public static get cards(): Readonly<CardModel[]> {
        return [...LibraryService._cards];
    }

    public static is(code: string) {
        return function (type: new () => CardModel) {
            const prototype = new type();
            LibraryService._cards.push(prototype);
            ChunkService.is(code)(type);
        }
    }
}