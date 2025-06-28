import { MinionCardModel } from "@/common/card/minion";
import { HeroModel } from "@/common/hero";
import { PlayerModel } from "@/common/player";

export enum TargetType {
    MinionRole,
    Role,
}

export type GameQuery = {
    side?: PlayerModel;
    isHero?: boolean;
    isRush?: boolean;
}

export type CardQuery = {
}