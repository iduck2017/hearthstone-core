import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { CostDecor, usePlayerMinionCostDecorConsumer } from "../../../rules/cost";
import { BuffOperatorType } from "../../../decors/role-attack";

@useModel('sea-giant-feat-model')
export class SeaGiantFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('sea-giant-feat-model');

    constructor() {
        super();
    }

    @usePlayerMinionCostDecorConsumer()
    protected _handleMinionCost(decor: CostDecor) {
        const game = this.game;
        if (!game) return;
        const minionCount = 
            game.playerA.board.minions.length + 
            game.playerB.board.minions.length;
        decor.addBuff({
            value: -minionCount,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
