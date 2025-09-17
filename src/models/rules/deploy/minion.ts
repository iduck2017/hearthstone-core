import { Event, Loader, TranxUtil } from "set-piece";
import { BoardModel } from "../../containers/board";
import { DeployModel } from "./index"
import { MinionCardModel } from "../../cards/minion";

export namespace MinionDeployProps {
    export type E = {};
    export type C = {};
    export type S = {};
    export type R = {};
    export type P = {
        minion: MinionCardModel;
    };
}

export class MinionDeployModel extends DeployModel<
    MinionDeployProps.E,
    MinionDeployProps.S,
    MinionDeployProps.C,
    MinionDeployProps.R,
    MinionDeployProps.P
> {
    constructor(loader?: Loader<MinionDeployModel>) {
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

    // equip
    public run(board?: BoardModel, index?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board, index);
        this.event.onRun(new Event());
    }

    @TranxUtil.span()
    private doRun(board: BoardModel, index?: number) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(minion);
        board.add(minion);
        board.sort(minion, index);
    }
}