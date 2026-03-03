import { BattlecryModel } from "../../hooks/battlecry";
import { Selector } from "../../utils/controller";
import { MinionModel } from "../../entities/minion";
import { HeroModel, RoleModel } from "../../entities/hero";

export class ElvenArcherBattlecryModel extends BattlecryModel<RoleModel> {

    public getSelector(params: Array<RoleModel | undefined>): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        const board = opponent.board;
        return {
            options: [...board.minions, opponent.hero],
        }
    }

    protected async _run(params: Array<RoleModel | undefined>): Promise<void> {
        const target = params[0];
        if (!target) return;
        target.receiveDamage({
            value: 1,
        })
    }
}