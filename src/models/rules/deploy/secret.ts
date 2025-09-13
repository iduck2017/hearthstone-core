import { Event, Loader, TranxUtil } from "set-piece";
import { BoardModel } from "../../containers/board";
import { DeployModel } from "./index"
import { WeaponCardModel } from "../../cards/weapon";
import { PlayerModel } from "../../player";
import { SecretCardModel } from "../../cards/secret";

export namespace SecretDeployProps {
    export type P = { secret: SecretCardModel; }
}

export class SecretDeployModel extends DeployModel<SecretDeployProps.P> {

    constructor(loader?: Loader<SecretDeployModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { secret: SecretCardModel.prototype },
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
        const secret = this.route.secret;
        if (!secret) return;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(secret);
        board.add(secret);
    }
}