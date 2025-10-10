import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { DamageModel } from "../models/damage";
import { CardModel, HeroModel } from "..";
import { AbortEvent } from "./event";

export enum DamageType {
    DEFAULT = 0,
    ATTACK = 1,
    DEFEND,
    SPELL,
    SKILL
}

export class DamageEvent extends AbortEvent<{
    type?: DamageType,
    source: CardModel | HeroModel;
    method: Model;
    target: RoleModel;
    origin: number;
    result: number;
    options: {
        isPoisonous?: boolean;
        isDivineShield?: boolean;
    }
}> {
    constructor(props: {
        type?: DamageType;
        source: CardModel | HeroModel;
        method: Model;
        target: RoleModel;
        origin: number;
    }) {
        super({
            ...props,
            result: props.origin,
            options: {},
        })
    }

    public set(value: number) { this._detail.result = value; }

    public config(options: {
        isPoisonous?: boolean;
        isDivineShield?: boolean;
    }) {
        this._detail.options = {
            ...this._detail.options,
            ...options,
        };
    }
}