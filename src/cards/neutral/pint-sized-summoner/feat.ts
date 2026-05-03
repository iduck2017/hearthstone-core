import { useState, useMemo, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { CostDecor, usePlayerMinionCostDecorConsumer } from "../../../rules/cost";
import { BuffOperatorType } from "../../../decors/role-attack";
import { CardPlayPostEvent, usePlayerCardPlay } from "../../../rules/deployers/card-deployer";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../entities/game";

@useModel('pint-sized-summoner-feat-model')
export class PintSizedSummonerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('pint-sized-summoner-feat-model');

    @useState()
    private _isMinionPlayed: boolean = false;
    @useMemo()
    public get isMinionPlayed() { return this._isMinionPlayed; }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    // Apply -1 cost to all friendly minions until the first one is played this turn.
    @usePlayerMinionCostDecorConsumer()
    protected _handleMinionCost(decor: CostDecor) {
        if (this.isMinionPlayed) return;
        decor.addBuff({
            value: -1,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }

    @usePlayerCardPlay()
    protected _handleCardPlay(event: CardPlayPostEvent) {
        if (!(event.card instanceof MinionModel)) return;
        this._isMinionPlayed = true;
    }

    @useTurnEndEventConsumer()
    protected _handleTurnEnd(_event: TurnEndPostEvent) {
        this._isMinionPlayed = false;
    }
}
