import { Event, Loader } from "set-piece";
import { PerformModel } from ".";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { RoleBattlecryModel } from "../../hooks/battlecry/role";
import { MinionHooksEvent } from "../../hooks/minion";
import { WeaponHooksEvent } from "../../hooks/weapon";
import { WeaponBattlecryModel } from "../../hooks/battlecry/weapon";
import { WeaponCardModel } from "../../cards/weapon";

export namespace WeaponPerformProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { weapon: WeaponCardModel; }
}

export class WeaponPerformModel extends PerformModel<
    [WeaponHooksEvent],
    WeaponPerformProps.E,
    WeaponPerformProps.S,
    WeaponPerformProps.C,
    WeaponPerformProps.R,
    WeaponPerformProps.P
> {
    constructor(loader?: Loader<WeaponPerformModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { weapon: WeaponCardModel.prototype },
            }
        });
    }

    public async run(from: number, event: WeaponHooksEvent) {
        const signal = new Event({})
        this.event.toRun(signal);
        if (signal.isCancel) return;

        const player = this.route.player;
        if (!player) return;
        const weapon = this.route.weapon;
        if (!weapon) return;
        // battlecry
        const hooks = weapon.child.hooks;
        const battlecry = hooks.child.battlecry;
        for (const item of battlecry) {
            const params = event.battlecry.get(item);
            if (!params) continue;
            await item.run(from, ...params);
        }
        // end
        const board = player.child.board;
        if (!board) return;
        const deploy = weapon.child.deploy;
        deploy.run(board);
        this.event.onRun();
    }

    public async toRun(): Promise<[WeaponHooksEvent] | undefined> {
        const weapon = this.route.weapon;
        if (!weapon) return;
        // battlecry
        const hooks = weapon.child.hooks;
        const battlecry = await WeaponBattlecryModel.toRun(hooks.child.battlecry);
        if (!battlecry) return;
        return [{ battlecry }];
    }

}