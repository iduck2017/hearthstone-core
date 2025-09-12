import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel } from "../../..";

export class MinionDisposeModel extends DisposeModel {
    public get route() {
        const route = super.route;
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        return {
            ...route,
            minion,
            player: route.order.find(item => item instanceof PlayerModel)
        }
    }

    constructor(loader?: Loader<MinionDisposeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    protected check(): boolean {
        const minion = this.route.minion;
        if (!minion) return true;
        const role = minion.child.role;
        const health = role.child.health;
        if (health.state.current <= 0) return true;
        return false;
    }

    protected run(): void {
        const minion = this.route.minion;
        if (!minion) return;
        this.doRemove();
        const hooks = minion.child.hooks;
        const deathrattle = hooks.child.deathrattle;
        for (const item of deathrattle) item.run();
    }

    @TranxUtil.span()
    public doRemove() {
        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;
        player.child.board.del(minion);
        player.child.graveyard.add(minion);
    }
}