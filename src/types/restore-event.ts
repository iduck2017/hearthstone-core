import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { RestoreModel } from "../models/rules/restore";
import { CardModel, HeroModel } from "..";
import { AbortEvent } from "./abort-event";

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