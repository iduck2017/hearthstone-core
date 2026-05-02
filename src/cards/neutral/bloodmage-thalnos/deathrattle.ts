import { useModel } from "set-piece";
import { DeathrattleModel } from "../../../feats/deathrattle";
import { useDeathrattleLaunchHook } from "../../../hooks/deathrattle-launcher";

@useModel('bloodmage-thalnos-deathrattle-model')
export class BloodmageThalnosDeathrattleModel extends DeathrattleModel {
    protected _brand: symbol = Symbol('bloodmage-thalnos-deathrattle-model');

    @useDeathrattleLaunchHook()
    protected _run(): void {
        const player = this.player;
        player?.drawCard();
    }
}
