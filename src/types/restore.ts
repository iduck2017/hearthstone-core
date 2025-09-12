import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { RestoreModel } from "../models/actions/restore";
import { CardModel, HeroModel } from "..";

export class RestoreEvent extends Event<{
    target: RoleModel;
    source: CardModel | HeroModel;
    detail: Model;
    origin: number;
    result: number;
}> {
    constructor(props: {
        target: RoleModel;
        source: CardModel | HeroModel;
        detail: Model;
        origin: number;
    }) {
        super({
            ...props,
            source: props.source,
            detail: props.detail,
            result: props.origin,
        });
    }

    public reset(number: number) {
        this._detail.result = number;
    }
}