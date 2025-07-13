import { DebugUtil, LogLevel, RouteUtil } from "set-piece";
import { GameModel, RootModel } from "../src";

export function boot(game: GameModel) {
    DebugUtil.level = LogLevel.ERROR;
    const root = new RootModel({});
    RouteUtil.boot(root);
    root.startGame(game);
    return root;
}