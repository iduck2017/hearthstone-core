import { DeathrattleModel } from "../../../features/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        opponent.hero.role.receiveDamage({
            value: 2,
        })
    }
}
