import { MinionCardModel } from "../model/card/minion";
import { PlayerModel } from "../model/player";

export type GameQuery = {
    side?: PlayerModel;
    isHero?: boolean;
    isRush?: boolean;
    isTaunt?: boolean;
}

export type CardQuery = {
}