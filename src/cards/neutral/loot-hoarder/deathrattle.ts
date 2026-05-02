import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleLaunchHook } from "../../../feats/deathrattle";


@useModel('loot-hoarder-deathrattle-model')
export class LootHoarderDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('loot-hoarder-deathrattle-model');
    @useDeathrattleLaunchHook()
    protected _run(): void {
        const player = this.player;
        player?.drawCard();
    }
}
