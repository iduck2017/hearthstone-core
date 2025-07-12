import { MinionCardModel } from "../model/card/minion";
import { HeroModel } from "../model/heroes";
import { PlayerModel } from "../model/player";

export enum TargetType {
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