import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";
import { BaineBloodhoofModel } from "../../derivatives/baine-bloodhoof";

@useModel('cairne-bloodhoof-deathrattle-model')
export class CairneBloodhoofDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('cairne-bloodhoof-deathrattle-model');
    @useDeathrattleRunHook()
    protected _run(): void {
        const board = this.player?.board;
        if (!board) return;
        const token = new BaineBloodhoofModel();
        token.summon(board);
    }
}
