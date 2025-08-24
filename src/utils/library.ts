import { Constructor, Model, StoreUtil } from "set-piece";
import { CardModel } from "../models/card";

export class LibraryUtil {
    private static readonly registry: CardModel[] = [];

    public static is(code: string) {
        return function (
            constructor: new (props: Record<string, never>) => CardModel
        ) {
            const prototype = new constructor({});
            LibraryUtil.registry.push(prototype);
            StoreUtil.is(code)(constructor);
        }
    }
}