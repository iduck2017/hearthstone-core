import { useChild, Model, useMemo, useModel } from "set-piece";
import { GameModel } from "./entities/game";

@useModel('app-model')
export class AppModel extends Model {
    protected _brand: symbol = Symbol('app-model');

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