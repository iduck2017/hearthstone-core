import { Event, Loader, TranxUtil } from "set-piece";
import { BoardModel } from "../../containers/board";
import { DeployModel } from "./index"
import { WeaponCardModel } from "../../cards/weapon";

export class WeaponDeployModel extends DeployModel {
    constructor(loader?: Loader<WeaponDeployModel>) {
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

    // equip
    public run(board?: BoardModel) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board);
        this.event.onRun();
    }

    @TranxUtil.span()
    private doRun(board: BoardModel) {
        const weapon = this.route.weapon;
        if (!weapon) return;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(weapon);
        const prev = board.child.weapon;
        if (prev) {
            prev.child.dispose.active(true);
            board.del(prev);
        }
        board.add(weapon);
    }
}