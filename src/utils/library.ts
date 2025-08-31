import { StoreUtil } from "set-piece";
import { MinionModel } from "../models/cards/minion";

export class LibraryUtil {
    private static readonly registry: MinionModel[] = [];

    public static is(code: string) {
        return function (
            constructor: new (props: Record<string, never>) => MinionModel
        ) {
            const prototype = new constructor({});
            LibraryUtil.registry.push(prototype);
            StoreUtil.is(code)(constructor);
        }
    }
}