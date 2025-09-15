import { GameModel, AppModel } from "hearthstone-core";

export function boot(game: GameModel) {
    const root = new AppModel();
    root.set(game);
    game.child.turn.next();
    return game;
}