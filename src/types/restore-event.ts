import { Event, Model } from "set-piece";
import { RestoreModel } from "../models/rules/card/restore";
import { CardModel, HeroModel, MinionCardModel } from "..";
import { AbortEvent } from "./abort-event";
import { RoleModel } from "../models/features/group/hero";

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

    public set(value: number, overflow?: number) {
        this._detail.result = value;
        if (overflow) this._detail.overflow = overflow;
    }
    
}