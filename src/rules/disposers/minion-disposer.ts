import { asRoute } from "set-piece";
import { MinionModel } from "../../entities/minion";
import { DisposerModel } from "./index";
import { PlayerModel } from "../../entities/player";
import { BoardModel } from "../../entities/board";
import { HandModel } from "../../entities/hand";
import { DeckModel } from "../../entities/deck";
import { RoleModel } from "../../entities/role";
import { GameModel } from "../../entities/game";

export class MinionDisposerModel extends DisposerModel {
    @asRoute(() => MinionModel)
    private _minion?: MinionModel;
    
    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;


    @asRoute(() => HandModel)
    private _hand?: HandModel;
   
    @asRoute(() => DeckModel)
    private _deck?: DeckModel;

    @asRoute(() => BoardModel)
    private _board?: BoardModel;
    
    public get container() {
        return this._board ?? this._hand ?? this._deck;
    }

    public get isActived() {
        const minion = this._minion;
        if (!minion) return true;
        if (this.isDestroyed) return true;
        if (minion.role.health.current <= 0) return true;
        return false;
    }

    public run() {
        if (!this.isActived) return;
        
        const player = this._player;
        if (!player) return;

        const card = this._minion;
        if (!card) return;
        this.container?.removeCard(card);
        player.graveyard.disposeCard(card);
    }

    public finishRun() {
        const minion = this._minion;
        if (!minion) return;
        const deathrattles = minion.deathrattles;
        deathrattles.forEach(hook => hook.run());
    }
}               