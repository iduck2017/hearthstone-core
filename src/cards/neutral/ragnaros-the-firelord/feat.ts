import { useMemo, useModel, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { AsleepDecor, useAsleepDecorConsumer } from "../../../rules/role-action";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../entities/game";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";

@useModel('ragnaros-the-firelord-feat-model')
export class RagnarosTheFirelordFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('ragnaros-the-firelord-feat-model');

    @useRoute(() => MinionModel)
    private minion?: MinionModel;
    @useRoute(() => HeroModel)
    private hero?: HeroModel;
    @useMemo()
    public get role() {
        return this.minion?.role ?? this.hero?.role
    }

    constructor() {
        super({
            subFeats: [new BoardOnlyControllerModel()]
        });
    }

    @useAsleepDecorConsumer()
    protected _handleAsleep(decor: AsleepDecor) {
        decor.sleep();
    }

    @useTurnEndEventConsumer(true)
    protected _handleTurnEnd(_event: TurnEndPostEvent) {
        const game = this.game;
        const player = this.player;
        if (!game || !player) return;
        const opponent = player.opponent;
        if (!opponent) return;
        const targets = [
            ...opponent.board.minions,
            opponent.hero,
        ];
        if (targets.length === 0) return;
        const index = Math.floor(Math.random() * targets.length);
        const target = targets[index];
        if (!target) return
        this.entity?.damageSource.launch({ 
            target: target.role, 
            value: 8 
        });
    }
}
