import { asRoute, Model } from "set-piece";
import { BoardModel } from "../entities/board";
import { PlayerModel } from "../entities/player";

export abstract class DeathrattleModel extends Model {
    @asRoute(() => BoardModel)
    private _board?: BoardModel;
    public get board() {
        return this._board;
    }

    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;
    public get player() {
        return this._player;
    }

    public abstract execute(): void;

    public abstract run(): void;
}