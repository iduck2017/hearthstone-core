import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel, WeaponCardModel } from "../../..";

export class WeaponDisposeModel extends DisposeModel {

    public get status(): boolean {
        const weapon = this.route.weapon;
        if (!weapon) return true;
        const action = weapon.child.action;
        if (action.state.current <= 0) return true;
        return super.status || false;
    }

    constructor(loader?: Loader<WeaponDisposeModel>) {
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

    @DebugUtil.log(LogLevel.WARN)
    protected run(): void {
        const weapon = this.route.weapon;
        if (!weapon) return;
        this.doRemove();
        const hooks = weapon.child.hooks;
        const deathrattle = hooks.child.deathrattle;
        for (const item of deathrattle) item.run();
    }

    @TranxUtil.span()
    public doRemove() {
        const weapon = this.route.weapon;
        if (!weapon) return;
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        board.del(weapon);
        const graveyard = player.child.graveyard;
        graveyard.add(weapon);
    }
}