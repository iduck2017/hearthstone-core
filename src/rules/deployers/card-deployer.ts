import { useMemo, useRoute } from "set-piece";
import { LauncherModel } from ".";
import { CardModel } from "../../cards";
import { HandModel } from "../../entities/hand";
import { DeckModel } from "../../entities/deck";
import { PlayerModel } from "../../entities/player";

export abstract class CardDeployerModel extends LauncherModel {
    @useMemo()
    public get isPlayable() {
        if (!this._player) return false;
        if (!this._game) return false;
        const card = this._card;
        if (!card) return false;
        // card must be in hand to be played
        if (!card.hand) return false;
        const currentPlayer = this._game.currentPlayer;
        if (currentPlayer !== this._player) return false;
        const mana = this._player.mana.current;
        const cost = card.cost.current;
        if (mana < cost) return false;
        return true;
    }

        
    @useRoute(() => CardModel)
    protected _card?: CardModel;

    @useRoute(() => HandModel)
    protected _hand?: HandModel;

    @useRoute(() => DeckModel)
    protected _deck?: DeckModel;
    
    /** Move this card from hand/deck/graveyard into the given player's workspace. */
    public prepare(player?: PlayerModel) {
        player = player ?? this._player;
        if (!player) return;
        const card = this._card;
        if (!card) return;
        this._hand?.removeCard(card);
        this._deck?.removeCard(card);
        player.workspace.addCard(card);
    }
}