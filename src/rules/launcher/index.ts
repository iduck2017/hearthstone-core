import { Model, useRoute } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { CardModel } from "../../cards";
import { GameModel } from "../../entities/game";

export abstract class LauncherModel extends Model {
    @useRoute(() => CardModel)
    protected _card?: CardModel;

    @useRoute(() => PlayerModel)
    protected _player?: PlayerModel;
    
    @useRoute(() => GameModel)
    protected _game?: GameModel;

    public abstract run(): Promise<void>;
}