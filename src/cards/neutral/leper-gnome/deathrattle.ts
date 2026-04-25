import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        this.entity?.damageSource.dealDamage({ target: opponent.hero.role, value: 2 });
    }
}
