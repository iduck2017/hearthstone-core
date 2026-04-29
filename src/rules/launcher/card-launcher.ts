import { useMemo } from "set-piece";
import { LauncherModel } from ".";

export abstract class CardLauncherModel extends LauncherModel {
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
}