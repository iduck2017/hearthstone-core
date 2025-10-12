import { Event, TranxUtil } from "set-piece";
import { BoardModel } from "../../board";
import { DeployModel } from "./index"
import { SecretCardModel } from "../../..";

export class SecretDeployModel extends DeployModel {
    public get route() {
        const result = super.route;
        const secret: SecretCardModel | undefined = result.list.find(item => item instanceof SecretCardModel);
        return {
            ...result,
            secret,
        }
    }

    constructor(props?: SecretDeployModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // deploy
    public run(board?: BoardModel) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board);
        this.event.onRun(new Event({}));
    }

    @TranxUtil.span()
    private doRun(board: BoardModel) {
        const secret = this.route.secret;
        if (!secret) return;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.drop(secret);
        board.add(secret);
    }
}