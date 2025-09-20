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
        });
    }

    public set(value: number) {
        this._detail.result = value;
    }
}