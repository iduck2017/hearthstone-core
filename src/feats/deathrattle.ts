import { useRoute, Model, useMemo, useModel } from "set-piece";
import { PlayerModel } from "../entities/player";
import { FeatModel } from ".";
import { deathrattleLauncherRegistry } from "../hooks/deathrattle-launcher";

@useModel('deathrattle-model')
export class DeathrattleModel extends FeatModel {
    protected _brand: symbol = Symbol('deathrattle-model');
    public run() {
        if (!this.isActived) return;
        const hooks = deathrattleLauncherRegistry.getHooks(this);
        for (const hook of hooks) hook();
    }
}