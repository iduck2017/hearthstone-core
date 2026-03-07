import { asChild, asTransaction, Model } from "set-piece";
import { CardModel, CardProps } from "../cards";
import { BoardModel } from "./board";
import { HooksLauncherModel, HookRegistry } from "../rules/hooks-launcher";
import { CostModel } from "../rules/cost";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";
import { RoleModel, RoleProps } from "./role";
import { MinionDisposerModel } from "../rules/disposers/minion-disposer";
import { DeathrattleModel } from "../hooks/deathrattle";
import { BattlecryModel } from "../hooks/battlecry";

export interface MinionProps extends RoleProps {
    cost: CostModel;
    attack: RoleAttackModel;
    health: RoleHealthModel;
    deathrattles?: DeathrattleModel[];
    battlecries?: BattlecryModel[];
}

export abstract class MinionModel extends CardModel {
    constructor(props: MinionProps) {
        super(props);
        this._role = new RoleModel(props);
        this._disposer = new MinionDisposerModel();
    }

    @asChild()
    private _role: RoleModel;
    public get role() {
        return this._role;
    }

    @asChild()
    protected _disposer: MinionDisposerModel;
    public get disposer() {
        return this._disposer;
    }

    @asChild()
    private _launcher?: HooksLauncherModel
    
    /** Summon: from anwhere to board */
    @asTransaction()
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

    @asTransaction()
    private finishSummon() {
        this._role.attack.setHeroSelectable(false);
        if (this._role.charge.isActived) {
            this._role.attack.setHeroSelectable(true);
        }
        if (this._role.charge.isActived || this._role.rush.isActived) {
            this._role.action.resetCurrent();
        }
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