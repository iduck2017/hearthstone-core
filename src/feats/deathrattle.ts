import { useRoute, Model, useMemo } from "set-piece";
import { PlayerModel } from "../entities/player";
import { getDeathrattleRunHooks } from "../hooks/deathrattle-run";
import { FeatModel } from ".";

export class DeathrattleModel extends FeatModel {
    public run() {
        if (!this.isActived) return;
        const hooks = getDeathrattleRunHooks(this);
        for (const hook of hooks) {
            hook();
        }
    }
}