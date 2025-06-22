import { MinionCardModel } from "@/common/card/minion";
import { BoardModel } from "@/common/container/board";
import { HandModel } from "@/common/container/hand";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { LegacyExtensionModel } from "@/extension/legacy";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";

export function boot() {
    console.log = () => undefined
    console.group = () => undefined
    console.groupEnd = () => undefined
    AppService.boot({
        extensions: [ new LegacyExtensionModel({}) ],
    });
}

export function startGame() {
    const root = AppService.root;
    if (!root) throw new Error();
    root.start({
        playerA: new PlayerModel({ child: { hero: new MageHeroModel({}) }}),
        playerB: new PlayerModel({ child: { hero: new MageHeroModel({}) }}),
    })
    const game = root.child.game;
    if (!game) throw new Error();
    return game;
}

export function resetBoard(
    groupA: MinionCardModel[],
    groupB: MinionCardModel[],
) {
    const root = AppService.root;
    const game = root?.child.game;
    if (!game) throw new Error();
    
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    boardA.reset();
    boardB.reset();
    boardA.add(...groupA);
    boardB.add(...groupB);

    return {
        boardA,
        boardB,
        game,
    }
}