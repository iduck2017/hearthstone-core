import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { DamagedGolemModel } from "../../derivatives/damaged-golem";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

@useModel('harvest-golem-deathrattle-model')
export class HarvestGolemDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('harvest-golem-deathrattle-model');
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        const board = player?.board;
        if (!board) return;
        const token = new DamagedGolemModel();
        token.summon(player, 0);
    }
}
