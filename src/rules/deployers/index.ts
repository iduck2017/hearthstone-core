import { Model, useRoute } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { CardModel } from "../../cards";
import { GameModel } from "../../entities/game";
import { HandModel } from "../../entities/hand";
import { DeckModel } from "../../entities/deck";
import { GraveyardModel } from "../../entities/graveyard";

export abstract class LauncherModel extends Model {
    @useRoute(() => PlayerModel)
    protected _player?: PlayerModel;
    
    @useRoute(() => GameModel)
    protected _game?: GameModel;

    public abstract launch(): Promise<void>;
}