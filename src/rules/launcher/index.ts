import { Model, useRoute } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { CardModel } from "../../cards";
import { HandModel } from "../../entities/hand";
import { DeckModel } from "../../entities/deck";
import { GraveyardModel } from "../../entities/graveyard";
import { GameModel } from "../../entities/game";

export abstract class LauncherModel extends Model {
    @useRoute(() => CardModel)
    protected _card?: CardModel;

    @useRoute(() => PlayerModel)
    protected _player?: PlayerModel;

    @useRoute(() => HandModel)
    private _hand?: HandModel;

    @useRoute(() => DeckModel)
    private _deck?: DeckModel;

    @useRoute(() => GameModel)
    protected _game?: GameModel;

    @useRoute(() => GraveyardModel)
    private _graveyard?: GraveyardModel;


    public abstract launch(): Promise<void>;

    protected moveToWorkspace(player?: PlayerModel) {
        player = player ?? this._player;
        if (!player) return;
        const card = this._card;
        if (this._hand) this._hand.removeCard(card);
        if (this._deck) this._deck.removeCard(card);
        if (this._graveyard) this._graveyard.removeCard(card)
        player?.workspace.addCard(card);
    }
}