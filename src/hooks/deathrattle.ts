import { useRoute, Model } from "set-piece";
import { BoardModel } from "../entities/board";
import { PlayerModel } from "../entities/player";

export abstract class DeathrattleModel extends Model {

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    protected get player() {
        return this._player;
    }

    protected abstract _run(): void;
    public run() {
        this._run();
    }
}