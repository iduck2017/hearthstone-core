import { DebugUtil, LogLevel, RouteUtil } from "set-piece";
import { GameModel, AppModel } from "../src";

export function boot(game: GameModel) {
    DebugUtil.level = LogLevel.ERROR;
    const root = new AppModel({});
    RouteUtil.boot(root);
    root.set(game);
    game.nextTurn();
    return root;
}