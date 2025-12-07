import { Model } from "set-piece";
import { CardModel, HeroModel } from "../..";
import { AbortEvent } from "./abort";
import { RoleModel } from "../../models/entities/heroes";

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
    detail: {
        isPoisonous?: boolean;
        isBlock?: boolean;
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
            detail: {},
        })
    }

    public update(value: number) { 
        this.origin.result = value; 
    }

    public supplement(options: {
        isPoisonous?: boolean;
        isBlock?: boolean;
    }) {
        this.origin.detail = {
            ...this.origin.detail,
            ...options,
        };
    }
}