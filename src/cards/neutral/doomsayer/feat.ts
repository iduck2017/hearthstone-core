import { useMemo, useRoute, useModel, useAction } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { TurnStartPostEvent, useTurnStartEventConsumer } from "../../../entities/game";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";

@useModel('doomsayer-feat-model')
export class DoomsayerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('doomsayer-feat-model');

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @useTurnStartEventConsumer(true)
    @useAction()
    protected _handleTurnStart(_event: TurnStartPostEvent) {
        const game = this.game;
        if (!game) return;
        const minions = [
            ...game.playerA.board.minions,
            ...game.playerB.board.minions,
        ];
        minions.forEach(target => {
            target.disposer.destroy();
        });
    }
}
