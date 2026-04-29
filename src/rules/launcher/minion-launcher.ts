import { Model, useAction, useDep, useMemo, useModel, useRoute, useState } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { MinionModel } from "../../cards/minion";
import { BattlecryModel } from "../../feats/battlecry";
import { CardLauncherModel } from "./card-launcher";

@useModel('minion-launcher')
export class MinionLauncherModel extends CardLauncherModel {
    protected _brand: symbol = Symbol('minion-launcher')

    @useRoute(() => MinionModel)
    protected _minion?: MinionModel
    @useMemo()
    protected get _role() {
        return this._minion?.role
    }

    @useState()
    private _summonedTurn?: number;
    @useMemo()
    public get summonedTurn() {
        return this._summonedTurn;
    }

    @useDep()
    private _options?: Array<[BattlecryModel, Array<Model | undefined>]>;

    @useState()
    private _currentIndex?: number;

    /** Summon from anywhere to board. board defaults to player.board; safe for fresh tokens. */
    public summon(player: PlayerModel, position: number) {
        player = player ?? this._player;
        if (!player) return;
        const board = player.board;
        position = position ?? board.cards.length;
        const minion = this._minion;
        if (!minion) return;
        minion.moveToWorkspace(player);
        minion.moveToBoard(board, position);
        this.finishSummon();
    }

    @useAction()
    public finishSummon() {
        const game = this._game;
        if (!game) return;
        const role = this._role;
        if (!role) return;
        this._summonedTurn = game.turn;
        role.action.sleep();
    }

    private async prepareRun() {
        const player = this._player;
        if (!player) return;
        const card = this._card;
        if (!card) return;
        const board = player.board;
        const positions = new Array(board.cards.length + 1).fill(0).map((_, index) => index);
        const boardIndex = await player.controller.fetchTarget({ options: positions })
        if (boardIndex === undefined) return;
        const hand = player.hand;
        const handIndex = hand.cards.indexOf(card);
        if (handIndex === -1) return;
        const options: Array<[BattlecryModel, Array<Model | undefined>]> = [];
        for (const hook of card.battlecries) {
            const params = await hook.getTargets();
            options.push([hook, params])
        }
        return {
            handIndex,
            boardIndex,
            options,
        }
    }

    public async run() {
        if (!this.isPlayable) return;
        const player = this._player;
        if (!player) return;
        const minion = this._minion;
        if (!minion) return;
        const result = await this.prepareRun();
        if (!result) return;
        minion.consumeMana();
        this.summon(player, result.boardIndex);
        this._options = result.options;
        this._currentIndex = 0;
        while (true) {
            const isFinished = await this.proceedRun()
            if (isFinished) break;
        }
        this._options = undefined;
        this._currentIndex = undefined;
    }

    private async proceedRun(): Promise<boolean> {
        if (!this._options) return false;
        if (this._currentIndex === undefined) return false;
        const currentStep = this._options[this._currentIndex];
        if (!currentStep) return true;
        const [currentHook, currentParams] = currentStep
        await currentHook.run(...currentParams);
        this._currentIndex += 1
        return false;
    }
}
