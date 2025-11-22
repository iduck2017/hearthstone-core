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

    protected get isActived(): boolean {
        const minion = this.route.minion;
        if (!minion) return true;
        if (minion.child.health.state.current <= 0) return true;
        return false;
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
    protected run() {
        const minion = this.route.minion;
        if (!minion) return;

        // execute
        this.doRun();
        // after
        DebugUtil.log(`${minion.name} Die`);
        const deathrattle = minion.child.deathrattle;
        deathrattle.forEach(item => item.run());
    }

    @TranxUtil.span()
    private doRun() {
        const player = this.route.player;
        if (!player) return;
        const minion: MinionCardModel | undefined = this.route.minion;
        if (!minion) return;
        player.child.board.del(minion);
        player.child.graveyard.add(minion);
    }

}