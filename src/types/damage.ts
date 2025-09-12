import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { DamageModel } from "../models/actions/damage";
import { CardModel, HeroModel } from "..";

export enum DamageType {
    DEFAULT = 0,
    ATTACK = 1,
    DEFEND,
    SPELL,
    SKILL
}

export class DamageEvent extends Event<{
    type?: DamageType;
    source: CardModel | HeroModel;
    detail: Model;
    target: RoleModel;
    origin: number;
    result: number;
}> {
    constructor(props: {
        type?: DamageType;
        source: CardModel | HeroModel;
        detail: Model;
        target: RoleModel;
        origin: number;
    }) {
        super({
            ...props,
            result: props.origin,
            detail: props.detail,
            type: props.type ?? DamageType.DEFAULT,
        });
    }

    public reset(number: number) {
        this._detail.result = number;
    }
}