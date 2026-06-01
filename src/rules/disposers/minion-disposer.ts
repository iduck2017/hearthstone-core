import { DisposerModel } from "./index";
import { DeckModel } from "../../entities/deck";
import { MinionModel } from "../../cards/minion";
import { useMemo, useRoute, useModel, Event, useEventConsumer } from "set-piece";
import { HandModel } from "../../entities/hand";
import { PlayerModel } from "../../entities/player";
import { BoardModel } from "../../entities/board";
import { FeatIntf } from "../../feats";

@useModel('minion-disposer-model')
export class MinionDisposerModel extends DisposerModel {
    protected _brand: symbol = Symbol('minion-disposer-model');
    constructor() {
        super();
        
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

    public executeLaunch() {
        if (!this.isActived) return;
        const player = this._player;
        if (!player) return;
        const card = this._minion;
        if (!card) return;
        this.container?.removeCard(card);
        player.graveyard.addCard(card);
        this.emitAsyncEvent(new MinionDisposePostEvent());
    }

    public finishLaunch() {
        const minion = this._minion;
        if (!minion) return;
        const deathrattles = minion.deathrattles;
        deathrattles.forEach(hook => hook.launch());
    }
}

export class MinionDisposePostEvent extends Event {
    protected _brand: symbol = Symbol('minion-dispose-post-event');
}

export function useMinionDisposeEventConsumer<I extends FeatIntf>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: MinionDisposePostEvent) => void>
    ) {
        useEventConsumer((that: I) => {
            if (!that.feat?.isActived) return;
            const game = that.game;
            if (!game) return;
            const cards = [
                ...game.playerA.cards,
                ...game.playerB.cards,
            ]
            const disposer = cards.map(card => card.disposer)
            return [disposer, MinionDisposePostEvent];
        })(prototype, key, descriptor);
    };
}               