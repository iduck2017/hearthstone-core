import { Event, Model } from "set-piece";
import { RestoreModel } from "../../models/features/rules/restore";
import { CardModel, HeroModel, MinionCardModel } from "../..";
import { AbortEvent } from "./abort";
import { RoleModel } from "../../models/entities/heroes";

export class RestoreEvent extends AbortEvent<{
    target: RoleModel;
    source: CardModel | HeroModel;
    method: Model;
    origin: number;
    result: number;
    overflow: number;
}> {
    constructor(props: {
        target: RoleModel;
        source: CardModel | HeroModel;
        method: Model;
        origin: number;
    }) {
        super({
            ...props,
            result: props.origin,
            overflow: 0,
        });
    }

    public update(value: number, overflow?: number) {
        this.origin.result = value;
        if (!overflow) return;
        this.origin.overflow = overflow;
    }
}