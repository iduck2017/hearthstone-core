import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { RestoreModel } from "../models/actions/restore";
import { CardModel, HeroModel } from "..";

export class RestoreEvent extends Event<{
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