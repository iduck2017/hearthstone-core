import { useRoute, Model, useMemo, useModel } from "set-piece";
import { PlayerModel } from "../entities/player";
import { getDeathrattleRunHooks } from "../hooks/deathrattle-run";
import { FeatModel } from ".";

@useModel('deathrattle-model')
export class DeathrattleModel extends FeatModel {
    protected _brand: symbol = Symbol('deathrattle-model');
    public run() {
        if (!this.isActived) return;
        const hooks = getDeathrattleRunHooks(this);
        for (const hook of hooks) hook();
    }
}