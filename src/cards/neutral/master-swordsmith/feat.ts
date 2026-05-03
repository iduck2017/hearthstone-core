import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../entities/game";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { MasterSmithBuffModel } from "./buff";

@useModel('master-swordsmith-feat-model')
export class MasterSmithFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('master-swordsmith-feat-model');

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @useTurnEndEventConsumer()
    protected _handleTurnEnd(_event: TurnEndPostEvent) {
        const game = this.game;
        const player = this.player;
        if (!game) return;
        if (!player) return;
        const minions = player.board.minions;
        const targets = minions.filter(minion => minion !== this.entity);
        if (!targets.length) return;
        const index = Math.floor(Math.random() * targets.length);
        const target = targets[index];
        if (!target) return;
        target.addFeat(new MasterSmithBuffModel());
    }
}
