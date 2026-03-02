import { asRoute, Model } from "set-piece";
import { BoardModel } from "../entities/board";
import { PlayerModel } from "../entities/player";

export abstract class BattlecryModel extends Model {
    @asRoute(() => BoardModel)
    protected _board?: BoardModel;

    @asRoute(() => PlayerModel)
    protected _player?: PlayerModel;

    public abstract execute(): void;
}