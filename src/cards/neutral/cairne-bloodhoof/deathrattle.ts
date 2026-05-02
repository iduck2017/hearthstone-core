import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleLaunchHook } from "../../../hooks/deathrattle-launcher";
import { BaineBloodhoofModel } from "../../derivatives/baine-bloodhoof";

@useModel('cairne-bloodhoof-deathrattle-model')
export class CairneBloodhoofDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('cairne-bloodhoof-deathrattle-model');
    @useDeathrattleLaunchHook()
    protected _run(): void {
        const player = this.player;
        if (!player) return;
        const token = new BaineBloodhoofModel();
        token.launcher.summon(player, 0);
    }
}
