import { MinionCardModel } from "../model/card/minion";
import { HeroModel } from "../model/hero";
import { PlayerModel } from "../model/player";

export enum TargetType {
    MinionRole,
    Role,
}

export type GameQuery = {
    side?: PlayerModel;
    isHero?: boolean;
    isRush?: boolean;
    isTaunt?: boolean;
}

export type CardQuery = {
}