import { DeathrattleModel } from "../../../feats/deathrattle";
import { DamagedGolemModel } from "../../derivatives/damaged-golem";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

export class HarvestGolemDeathrattleModel extends DeathrattleModel {
    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        const board = player?.board;
        if (!board) return;
        const token = new DamagedGolemModel();
        token.summon(board);
    }
}
