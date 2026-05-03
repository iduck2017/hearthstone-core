import { useAction, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../entities/game";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";

@useModel('baron-geddon-feat-model')
export class BaronGeddonFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('baron-geddon-feat-model');

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @useTurnEndEventConsumer(true)
    @useAction()
    protected _handleTurnEnd(_event: TurnEndPostEvent) {
        const game = this.game;
        const damageSource = this.entity?.damageSource;
        if (!game) return;
        if (!damageSource) return;
        const targets = [
            ...game.playerA.board.minions,
            ...game.playerB.board.minions,
            game.playerA.hero,
            game.playerB.hero,
        ].filter(entity => entity !== this.entity);
        targets.forEach(target => {
            damageSource.launch({ 
                target: target.role, 
                value: 2 
            });
        });
    }
}
