import { Model, useAction, useChild, useDep, useMemo, useModel, useRoute, useState } from "set-piece";
import { PlayerModel } from "../../entities/player";
import { MinionModel } from "../../cards/minion";
import { BattlecryModel } from "../../feats/battlecry";
import { CardDeployerModel } from "./card-launcher";
import { DeployIntensionModel } from "../deploy-intension";

@useModel('minion-deployer')
export class MinionDeployerModel extends CardDeployerModel {
    protected _brand: symbol = Symbol('minion-deployer')

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

    @useState()
    private _position?: number;

    @useChild()
    private intensions?: DeployIntensionModel[];

    /** Summon from anywhere to board. board defaults to player.board; safe for fresh tokens. */
    public summon(player: PlayerModel, position: number) {
        player = player ?? this._player;
        if (!player) return;
        const board = player.board;
        position = position ?? board.cards.length;
        const minion = this._minion;
        if (!minion) return;
        minion.prepare(player);
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

    private async prepareLaunch() {
        const player = this._player;
        if (!player) return;
        const card = this._card;
        if (!card) return;
        const board = player.board;
        const positions = new Array(board.cards.length + 1).fill(0).map((_, index) => index);
        const position = await player.controller.fetchTarget({ options: positions })
        if (position === undefined) return;
        const intensions: DeployIntensionModel[] = [];
        for (const feat of card.battlecries) {
            const params = await feat.getTargets();
            const intension = new DeployIntensionModel({ feat, params })
            intensions.push(intension)
        }
        this._position = position;
        this.intensions = intensions;
        return true;
    }

    public async launch() {
        if (!this.isPlayable) return;
        const player = this._player;
        if (!player) return;
        const minion = this._minion;
        if (!minion) return;
        const isValid = await this.prepareLaunch();
        if (!isValid) return;
        minion.consumeMana();
        if (this._position === undefined) return;
        this.summon(player, this._position);
        while (this.intensions?.length) {
            const intension = this.intensions.pop();
            intension?.launch();
        }
        this.intensions = undefined;
    }

}
