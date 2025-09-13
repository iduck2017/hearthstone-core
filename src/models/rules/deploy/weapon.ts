import { Event, Loader, TranxUtil } from "set-piece";
import { BoardModel } from "../../containers/board";
import { DeployModel } from "./index"
import { WeaponCardModel } from "../../cards/weapon";
import { PlayerModel } from "../../player";

export class WeaponDeployModel extends DeployModel {
    public get route() {
        const route = super.route;
        const weapon: WeaponCardModel | undefined = route.order.find(item => item instanceof WeaponCardModel);
        return {
            ...route,
            weapon,
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    constructor(loader?: Loader<WeaponDeployModel>) {
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
    public run(board?: BoardModel) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board);
        this.event.onRun(new Event({}))
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
            prev.child.dispose.active({
                source: weapon,
                detail: this,
            }, true);
            board.del(prev);
        }
        board.add(weapon);
    }
}