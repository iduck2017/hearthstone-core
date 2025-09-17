import { Event } from "set-piece";
import { PerformModel } from ".";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { RoleBattlecryModel } from "../../hooks/battlecry/role";
import { MinionHooksEvent } from "../../hooks/minion";

export class MinionPerformModel extends PerformModel<
    [number, MinionHooksEvent]
> {
    public async run(from: number, to: number, event: MinionHooksEvent) {
        
        const signal = new Event({})
        this.event.toRun(signal);
        if (signal.isCancel) return;

        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;
        // battlecry
        const hooks = minion.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(from, to, ...params);
        }
        // end
        const board = player.child.board;
        if (!board) return;
        const deploy = minion.child.deploy;
        deploy.run(board, to);
        this.event.onRun();
    }

    public async toRun(): Promise<[number, MinionHooksEvent] | undefined> {
        const minion = this.route.minion;
        if (!minion) return;
        const to = await this.select();
        if (to === undefined) return;
        // battlecry
        const hooks = minion.child.hooks;
        const battlecry = await RoleBattlecryModel.toRun(hooks.child.battlecry);
        if (!battlecry) return;
        return [to, { battlecry }];
    }

    private async select(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.minions.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options));
        return position;
    }
}