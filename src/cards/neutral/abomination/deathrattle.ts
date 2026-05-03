import { useAction, useModel } from "set-piece";
import { DeathrattleModel, useDeathrattleLaunchHook } from "../../../feats/deathrattle";

@useModel('abomination-deathrattle-model')
export class AbominationDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('abomination-deathrattle-model');

    @useDeathrattleLaunchHook()
    @useAction()
    protected _handleLaunch(): void {
        const game = this.game;
        const entity = this.entity;
        if (!game) return;
        if (!entity) return
        const targets = [
            ...game.playerA.board.minions,
            ...game.playerB.board.minions,
            game.playerA.hero,
            game.playerB.hero,
        ].filter(target => target !== entity);
        targets.forEach(target => {
            entity.damageSource.launch({
                target: target.role,
                value: 2
            });
        });
    }
}
