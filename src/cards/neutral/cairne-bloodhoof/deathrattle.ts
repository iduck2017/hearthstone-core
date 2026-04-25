import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";
import { BaineBloodhoofModel } from "../../derivatives/baine-bloodhoof";

export class CairneBloodhoofDeathrattleModel extends DeathrattleModel {
    @useDeathrattleRunHook()
    protected _run(): void {
        const board = this.player?.board;
        if (!board) return;
        const token = new BaineBloodhoofModel();
        token.summon(board);
    }
}
