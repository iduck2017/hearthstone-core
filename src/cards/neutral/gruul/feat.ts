import { useAction, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../entities/game";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { GruulBuffModel } from "./buff";

@useModel('gruul-feat-model')
export class GruulFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('gruul-feat-model');

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @useTurnEndEventConsumer()
    @useAction()
    protected _handleTurnEnd(_event: TurnEndPostEvent) {
        const minion = this.entity;
        if (!minion) return;
        minion.addFeat(new GruulBuffModel());
    }
}
