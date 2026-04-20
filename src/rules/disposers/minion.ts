import { DisposerModel } from "./index";
import { DeckModel } from "../../entities/deck";
import { MinionModel } from "../../cards/minion";
import { useMemo, useRoute } from "set-piece";
import { HandModel } from "../../entities/hand";
import { PlayerModel } from "../../entities/player";
import { BoardModel } from "../../entities/board";

export class MinionDisposerModel extends DisposerModel {
    constructor() {
        super();
        this.init();
    }
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useRoute(() => HandModel)            
    private _hand?: HandModel;
   
    @useRoute(() => DeckModel)
    private _deck?: DeckModel;

    @useRoute(() => BoardModel)
    private _board?: BoardModel;
    
    @useMemo()
    public get container() {
        return this._board ?? this._hand ?? this._deck;
    }

    @useMemo()
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