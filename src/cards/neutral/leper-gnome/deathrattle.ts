import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleLaunchHook } from "../../../hooks/deathrattle-launcher";

@useModel('leper-gnome-deathrattle-model')
export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('leper-gnome-deathrattle-model');
    @useDeathrattleLaunchHook()
    protected _run(): void {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        this.entity?.damageSource.dealDamage({ target: opponent.hero.role, value: 2 });
    }
}
