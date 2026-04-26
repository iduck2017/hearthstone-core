import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

@useModel('leper-gnome-deathrattle-model')
export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('leper-gnome-deathrattle-model');
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        this.entity?.damageSource.dealDamage({ target: opponent.hero.role, value: 2 });
    }
}
