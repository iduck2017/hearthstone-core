import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleRunHook } from "../../../hooks/deathrattle-run";

@useModel('bloodmage-thalnos-deathrattle-model')
export class BloodmageThalnosDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('bloodmage-thalnos-deathrattle-model');

    @useDeathrattleRunHook()
    protected _run(): void {
        const player = this.player;
        player?.drawCard();
    }
}
