import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { ShatteredSunClericBuffModel } from "./buff";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useConsoleGroup, useModel } from "set-piece";

@useModel('shattered-sun-cleric-battlecry-model')
export class ShatteredSunClericBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('shattered-sun-cleric-battlecry-model');
    constructor() {
        super();
        
    }

    public getSelector(params: Array<RoleModel | undefined>): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const options = player.board.minions.map(minion => minion.role);
        return { options };
    }

    @useBattlecryRunHook()
    @useConsoleGroup()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.entity?.addFeature(new ShatteredSunClericBuffModel());
    }
}
