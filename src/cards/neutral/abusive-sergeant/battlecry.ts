import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { AbusiveSergeantBuffModel } from "./buff";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useConsoleGroup, useModel } from "set-piece";

@useModel('abusive-sergeant-battlecry-model')
export class AbusiveSergeantBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('abusive-sergeant-battlecry-model');
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
        console.log('Buff target', target.name)
        target.entity?.addFeature(new AbusiveSergeantBuffModel());
    }
}
