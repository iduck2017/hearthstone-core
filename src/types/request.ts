import { CardModel } from "../model/card";
import { RoleModel } from "../model/role";
import { DamageMode } from "./enums";

export type DamageReq = {
    target: RoleModel;
    source?: CardModel;
    damage: number;
    dealDamage: number;
    mode: DamageMode;
}

export type DamageRes = DamageReq & {
    prevState: RoleModel['state'];
    nextState: RoleModel['state'];
    recvDamage: number;
}

export type SelectReq<T = any> = {
    candidates: T[];
    hint?: string;
}
