import { useMemo, useRoute } from "set-piece";
import { DeathrattleModel } from "../../../features/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";
import { MinionModel } from "../../minion";

export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get minion() {
        return this._minion;
    }

    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        this._minion?.damageSource.dealDamage({ target: opponent.hero.role, value: 2 });
    }
}
