import { asChild, Model } from "set-piece";
import { GameModel } from "./entities/game";

export class AppModel extends Model {
    @asChild()
    private _game?: GameModel;
    public get game() {
        return this._game;
    }
    public setGame(game?: GameModel) {
        this._game = game ?? new GameModel();
    }
    public removeGame(game?: GameModel) {
        this._game = undefined;
    }
}