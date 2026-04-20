import { Model, TypedPropertyDecorator, useChild, useMemo, useRoute, useState, useAction } from "set-piece";
import { CardModel, CardProps } from ".";
import { PlayerModel } from "../entities/player";
import { RoleModel, RoleProps } from "../entities/role";
import { MinionDisposerModel } from "../rules/disposers/minion";
import { HookRegistry, HooksLauncherModel } from "../rules/hooks-launcher";
import { BoardModel } from "../entities/board";
import { RoleHealthModel } from "../rules/role-health";

export interface MinionProps extends CardProps {
    role: RoleModel;
}
export abstract class MinionModel extends CardModel {
    constructor(props: MinionProps) {
        super(props);
        this._role = props.role;
        this._disposer = new MinionDisposerModel();
        this.init()
    }

    @useChild()
    private _role: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useChild()
    protected _disposer: MinionDisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

    @useChild()
    private _launcher?: HooksLauncherModel

    @useState()
    private _summonedTurn?: number;
    @useMemo()
    public get summonedTurn() {
        return this._summonedTurn;
    }
    
    /** Summon: from anwhere to board */
    @useAction()
    public summon(board?: BoardModel, position?: number) {
        board = board ?? this.player?.board;
        if (!board) {
            console.error('Board not found');
            return;
        }        
        position = position ?? board.cards.length;
        this.container?.removeCard(this);
        board.summonMinion(this, position);
        this.finishSummon();
    }

    @useAction()
    private finishSummon() {
        const game = this.game;
        if (!game) return;
        this._summonedTurn = game.turn;
        this._role.action.sleep();
    }

    /** Play: from hand to board */
    /** Just user intention */
    public async preparePlay(): Promise<{
        handIndex: number;
        boardIndex: number;
        hookRegistry: HookRegistry;
    } | undefined> {
        const player = this.player;
        if (!player) return;
        
        const board = player.board;
        const positions = new Array(board.cards.length + 1).fill(0).map((_, index) => index);
        const boardIndex = await player.controller.fetchTarget({
            options: positions,
        })
        if (boardIndex === undefined) return;
        const hand = player.hand;
        const handIndex = hand.cards.indexOf(this);
        if (handIndex === -1) return;
        
        const hookRegistry: HookRegistry = []
        for (const hook of this.battlecries) {
            const params = await hook.getTargets();
            hookRegistry.push({ hook, params })
        }
        return {
            handIndex,
            boardIndex,
            hookRegistry,
        }
    }

    public async play() {
        const player = this.player;
        if (!player) return;

        /** Prepare */
        const options = await this.preparePlay();
        if (!options) return;

        const board = player.board;
        this.consumeMana();
        this.summon(board, options.boardIndex);
        
        /** Launch */
        this._launcher = new HooksLauncherModel({
            registry: options.hookRegistry,
        });
        while (true) {
            const isFinished = await this._launcher.next();
            if (isFinished) break;
        }
        this._launcher = undefined;
    }

}