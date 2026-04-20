import { useChild, Model, useMemo } from "set-piece";
import { GameModel } from "./entities/game";

export class AppModel extends Model {
    constructor() {
        super();
        this.init();
    }

    @useChild()
    private _game?: GameModel;
    @useMemo()
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