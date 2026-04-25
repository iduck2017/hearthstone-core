import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

export class LootHoarderDeathrattleModel extends DeathrattleModel {
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        player?.drawCard();
    }
}
