import { useAction, useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { RaceType } from "../../../utils/enums";
import { ColdlightSeerBuffModel } from "./buff";

@useModel('coldlight-seer-battlecry-model')
export class ColdlightSeerBattlecryModel extends BattlecryModel {
    protected _brand: symbol = Symbol('coldlight-seer-battlecry-model');

    @useBattlecryLaunchHook()
    @useAction()
    private async handleRun(): Promise<void> {
        const player = this.player;
        const card = this.entity;
        if (!player) return;
        if (!card) return;
        const murlocs = player.board.minions.filter(
            minion => minion.races.includes(RaceType.MURLOC) && minion !== card
        );
        murlocs.forEach(murloc => {
            murloc.addFeat(new ColdlightSeerBuffModel());
        });
    }
}
