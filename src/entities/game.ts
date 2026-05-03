import { useChild, useState, Event, Model, TypedPropertyDecorator, useRoute, useEventConsumer, PrevEvent, useMemo, useModel, useAction } from "set-piece";
import { PlayerModel } from "./player";
import { MageModel } from "../heroes/mage";
import { FeatIntf } from "../feats";

export class TurnEndPostEvent extends Event {
    protected _brand: symbol = Symbol('turn-end-event');
}
export class TurnEndPrevEvent extends PrevEvent<{}> {
    protected _brand: symbol = Symbol('turn-end-prev-event');
}

export class TurnStartPostEvent extends Event {
    protected _brand: symbol = Symbol('turn-start-event');
}
export class TurnStartPrevEvent extends PrevEvent<{}> {
    protected _brand: symbol = Symbol('turn-start-prev-event');
}

@useModel('game-model')
export class GameModel extends Model {
    protected _brand: symbol = Symbol('game-model');

    constructor(props?: {
        playerA?: PlayerModel;
        playerB?: PlayerModel;
    }) {
        super();
        this._playerA = props?.playerA ?? 
            new PlayerModel({ hero: new MageModel() });
        this._playerB = props?.playerB ?? 
            new PlayerModel({ hero: new MageModel() });
    }

    @useChild()
    private _playerA: PlayerModel;
    @useMemo()
    public get playerA() { return this._playerA }

    @useChild()
    private _playerB: PlayerModel;
    @useMemo()
    public get playerB() { return this._playerB }

    @useMemo()
    public get currentPlayer() {
        if (this._turn % 2) return this._playerA;
        return this._playerB;
    }

    @useState()
    private _isStarted: boolean = false;
    @useMemo()
    public get isStarted() { return this._isStarted }

    @useState()
    private _turn: number = 0;
    @useMemo()
    public get turn() { return this._turn }

    public nextTurn() {
        this.endTurn({});
        this._turn += 1;
        this.startTurn();
    }

    private endTurn(options: {}) {
        const prevEvent = new TurnEndPrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        const postEvent = new TurnEndPostEvent();
        this.emitAsyncEvent(postEvent);
    }

    @useAction()
    private startTurn() {
        const prevEvent = new TurnStartPrevEvent({});
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        const currentPlayer = this.currentPlayer;
        currentPlayer.mana.upgrade(1);
        currentPlayer.mana.reset();
        currentPlayer.hero.role.action.wakeup();
        currentPlayer.hero.role.attack.setHeroSelectable(true);
        currentPlayer.hero.role.action.resetCurrent();
        const minions = currentPlayer.board.minions;
        minions.forEach(minion => {
            minion.role.action.wakeup();
            minion.role.attack.setHeroSelectable(true);
            minion.role.action.resetCurrent();
        });
        const postEvent = new TurnStartPostEvent();
        this.emitAsyncEvent(postEvent);
    }

    public start(options?: {
        isInitPhaseIgnored?: boolean;
    }) {
        if (this._isStarted) return;
        this._isStarted = true;
        if (!options?.isInitPhaseIgnored) {
            this._playerA.prepareGame(true);
            this._playerB.prepareGame(false);
        }
        this.nextTurn();
    }

}

export function useTurnEndPrevEventConsumer<I extends FeatIntf>(isPlayerTurn?: boolean) {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: TurnEndPrevEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const game = self.game;
            if (!game) return;
            if (!self.feat?.isActived) return;
            if (isPlayerTurn === true && game.currentPlayer !== self.player) return;
            if (isPlayerTurn === false && game.currentPlayer === self.player) return;
            return [game, TurnEndPrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useTurnEndEventConsumer<I extends FeatIntf>(isPlayerTurn?: boolean) {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: TurnEndPostEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const game = self.game;
            if (!game) return;
            if (!self.feat?.isActived) return;
            if (isPlayerTurn === true && game.currentPlayer !== self.player) return;
            if (isPlayerTurn === false && game.currentPlayer === self.player) return;
            return [game, TurnEndPostEvent]
        })(prototype, key, descriptor);
    }
}

export function useTurnStartPrevEventConsumer<I extends FeatIntf>(isPlayerTurn?: boolean) {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: TurnStartPrevEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const game = self.game;
            if (!game) return;
            if (!self.feat?.isActived) return;
            if (isPlayerTurn === true && game.currentPlayer !== self.player) return;
            if (isPlayerTurn === false && game.currentPlayer === self.player) return;
            return [game, TurnStartPrevEvent]
        })(prototype, key, descriptor);
    }
}

export function useTurnStartEventConsumer<I extends FeatIntf>(isPlayerTurn?: boolean) {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: TurnStartPostEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const game = self.game;
            if (!game) return;
            if (!self.feat?.isActived) return;
            if (isPlayerTurn === true && game.currentPlayer !== self.player) return;
            if (isPlayerTurn === false && game.currentPlayer === self.player) return;
            return [game, TurnStartPostEvent]
        })(prototype, key, descriptor);
    }
}
