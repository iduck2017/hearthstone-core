import { Constructor, Model, StoreUtil } from "set-piece";
import { CardModel } from "../model/card";

export class LibraryUtil {
    private static readonly registry: CardModel[] = [];

    public static is(code: string) {
        return function (
            constructor: new (props: Record<string, never>) => CardModel
        ) {
            const prototype = new constructor({});
            console.log('create', prototype)
            LibraryUtil.registry.push(prototype);
            StoreUtil.is(code)(constructor);
        }
    }
}