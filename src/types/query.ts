import { MinionCardModel } from "../model/card/minion";
import { PlayerModel } from "../model/player";
import { RoleModel } from "../model/role";
import { QueryMode } from "./enums";

export type RoleQuery = {
    side?: PlayerModel;
    isHero?: QueryMode;
    isMinion?: QueryMode;
    isTaunt?: QueryMode;
}

export type CardQuery = {
}

export type TmplQuery = {
    
}