import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

@useModel('loot-hoarder-deathrattle-model')
export class LootHoarderDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('loot-hoarder-deathrattle-model');
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        player?.drawCard();
    }
}
