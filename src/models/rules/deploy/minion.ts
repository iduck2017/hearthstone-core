import { Event, Loader, TranxUtil } from "set-piece";
import { BoardModel } from "../../containers/board";
import { DeployModel } from "./index"
import { WeaponCardModel } from "../../cards/weapon";
import { PlayerModel } from "../../player";
import { SecretCardModel } from "../../cards/secret";
import { MinionCardModel } from "../../cards/minion";

export class MinionDeployModel extends DeployModel {
    public get route() {
        const route = super.route;
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        return {
            ...route,
            minion,
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }


    constructor(loader?: Loader<MinionDeployModel>) {
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

    // equip
    public run(board?: BoardModel, index?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board, index);
        this.event.onRun(new Event({}))
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