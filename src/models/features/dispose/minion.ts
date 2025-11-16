import { DebugUtil, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel } from "../../..";

export class MinionDisposeModel extends DisposeModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion,
        }
    }

    public get status(): boolean {
        const minion = this.route.minion;
        if (!minion) return true;
        const health = minion.child.health;
        if (health.state.current <= 0) return true;
        return super.status || false;
    }

    constructor(props?: MinionDisposeModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DebugUtil.span()
    protected start() {
        const minion = this.route.minion;
        if (!minion) return;
        DebugUtil.log(`${minion.name} Die`);
        this.run();
        const deathrattle = minion.child.deathrattle;
        deathrattle.forEach(item => item.start());
    }

    @TranxUtil.span()
    public run() {
        const player = this.route.player;
        if (!player) return;
        const minion: MinionCardModel | undefined = this.route.minion;
        if (!minion) return;
        player.child.board.del(minion);
        player.child.graveyard.add(minion);
    }
}