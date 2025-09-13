import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel } from "../../..";

export namespace MinionDisposeProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { minion: MinionCardModel; }
}

export class MinionDisposeModel extends DisposeModel<
    MinionDisposeProps.E, 
    MinionDisposeProps.S, 
    MinionDisposeProps.C,
    MinionDisposeProps.R,
    MinionDisposeProps.P
> {

    constructor(loader?: Loader<MinionDisposeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { minion: MinionCardModel.prototype },
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