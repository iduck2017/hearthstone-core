import { MinionCardModel } from "@/common/card/minion";
import { HeroModel } from "@/common/hero";
import { PlayerModel } from "@/common/player";

export enum TargetType {
    MinionRole,
    HeroRole,
}

export type GameQuery = {
    side?: PlayerModel;
}

export type CardQuery = {
}