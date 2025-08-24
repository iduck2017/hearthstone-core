import { DebugUtil, LogLevel, RouteUtil } from "set-piece";
import { GameModel, AppModel } from "../src";

export function boot(game: GameModel) {
    const root = new AppModel({});
    RouteUtil.boot(root);
    root.set(game);
    game.child.turn.next();
    return root;
}