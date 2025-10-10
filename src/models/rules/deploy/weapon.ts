import { Event, TranxUtil } from "set-piece";
import { BoardModel } from "../../board";
import { DeployModel } from "./index"
import { WeaponCardModel } from "../../..";

export namespace WeaponDeployModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export class WeaponDeployModel extends DeployModel<
    WeaponDeployModel.E,
    WeaponDeployModel.S,
    WeaponDeployModel.C,
    WeaponDeployModel.R
> {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.list.find(item => item instanceof WeaponCardModel);
        return {
            ...result,
            weapon,
        }
    }

    constructor(props?: WeaponDeployModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // equip
    public run(board?: BoardModel) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doRun(board);
        this.event.onRun(new Event({}));
    }

    @TranxUtil.span()
    private doRun(board: BoardModel) {
        const weapon = this.route.weapon;
        if (!weapon) return;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.use(weapon);
        const prev = board.child.weapon;
        if (prev) {
            prev.child.dispose.active(true);
            board.del(prev);
        }
        board.add(weapon);
    }
}