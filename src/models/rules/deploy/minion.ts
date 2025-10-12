import { Event, TranxUtil } from "set-piece";
import { BoardModel } from "../../board";
import { DeployModel } from "./index"
import { MinionCardModel } from "../../..";

export class MinionDeployModel extends DeployModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion,
        }
    }

    constructor(props?: MinionDeployModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // summon
    public run(board?: BoardModel, index?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board, index);
        this.event.onRun(new Event({}));
    }

    @TranxUtil.span()
    private doRun(board: BoardModel, index?: number) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.drop(minion);
        board.add(minion, index);
    }
}