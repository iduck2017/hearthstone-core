import { asChild, asRoute, asState, asTransaction, Model } from "set-piece";
import { AttackModel } from "../rules/attack";
import { CardModel } from "./card";
import { HealthModel } from "../rules/health";
import { BoardModel } from "./board";
import { PlayerModel } from "./player";
import { registerDisposer, useCardDisposer } from "../utils/dispose";
import { Selector } from "../utils/controller";
import { CostModel } from "../rules/cost";
import { BattlecryModel } from "../hooks/battlecry";

export abstract class MinionModel extends CardModel {

    public get source() {
        return this.board ?? this.hand ?? this.deck;
    }

    @asChild()
    private _attack: AttackModel;
    public get attack() {
        return this._attack;
    }

    @asChild()
    private _health: HealthModel;
    public get health() {
        return this._health;
    }

    constructor(props?: {
        attack?: AttackModel;
        cost?: CostModel;
        health?: HealthModel;
    }) {
        super(props);
        this._attack = props?.attack ?? new AttackModel();
        this._health = props?.health ?? new HealthModel();
    }


    /** Attack and receiveAttacl */
    @useCardDisposer()
    @asTransaction()
    public attackMinion(options: {
        target: MinionModel;
    }) {
        const { target } = options;
        const selfAttack = this._attack.current;
        const targetAttack = target.attack.current;
        this.receiveDamage({
            value: targetAttack,
        })
        target.receiveDamage({
            value: selfAttack,
        })
    }
    @useCardDisposer()
    public receiveDamage(options: {
        value: number;
    }) {
        registerDisposer(this);
        console.log('Receive damage', options.value);
        this.health.loseCurrent(options.value);
    }


    /** Summon: from anwhere to board */
    @asTransaction()
    public summon(board?: BoardModel, position?: number) {
        board = board ?? this.player?.board;
        if (!board) {
            console.error('Board not found');
            return;
        }        
        position = position ?? board.cards.length;
        this.source?.delCard(this);
        board.summonMinion(this, position);
    }


    /** Dispose: from anwhere to graveyard */
    @asState()
    private _isDestroyed: boolean = false;
    public destroy() {
        this._isDestroyed = true;
    }
    
    public get isDisposable() {
        if (this._health.current <= 0) return true;
        if (this._isDestroyed) return true;
        return false; 
    }
    @asTransaction()
    public dispose() {
        if (!this.isDisposable) return;
        
        const player = this.player;
        if (!player) {
            console.error('Player not found');
            return;
        }
        this.source?.delCard(this);
        player.graveyard.disposeCard(this);
    }

    /** Play: from hand to board */
    /** Just user intention */
    public async preparePlay() {
        const player = this.player;
        if (!player) {
            console.error('Player not found');
            return;
        }
        const board = player.board;
        const positions = new Array(board.cards.length + 1).fill(0).map((_, index) => index);
        const position = await player.controller.fetchTarget({
            options: positions,
        })
        const paramMap: Map<BattlecryModel, Model | undefined>= new Map();
        for (const hook of this.battlecries) {
            const selector = hook.selector;
            if (!selector) {
                paramMap.set(hook, undefined);
            } else {
                const target = await player.controller.fetchTarget(selector);
                paramMap.set(hook, target);
            }
        }
        return {
            board,
            position,
            paramMap,
        }
    }
    public async play() {
        const { board, position } = await this.preparePlay() ?? {};
        this.consumeMana();
        this.summon(board, position);
    }
}