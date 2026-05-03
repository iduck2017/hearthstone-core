import { Model, useModel } from "set-piece";
import { BattlecryModel, useBattlecryLaunchHook } from "../../../feats/battlecry";
import { CaptainGreenskinBuffModel } from "./buff";

@useModel('captain-greenskin-battlecry-model')
export class CaptainGreenskinBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('captain-greenskin-battlecry-model');

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const weapon = this.player?.hero?.weapon;
        if (!weapon) return;
        weapon.addFeat(new CaptainGreenskinBuffModel());
    }
}
