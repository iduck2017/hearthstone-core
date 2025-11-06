import { DebugUtil,  Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel, WeaponCardModel } from "../../..";
import { SecretCardModel } from "../secret";

export class SecretDisposeModel extends DisposeModel {
    public get route() {
        const result = super.route;
        const secret: SecretCardModel | undefined = result.items.find(item => item instanceof SecretCardModel);
        return {
            ...result,
            secret,
        }
    }

    constructor(props?: SecretDisposeModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected run() {
        const secret = this.route.secret;
        if (!secret) return;
        this.doRemove();
    }

    @TranxUtil.span()
    public doRemove() {
        const secret = this.route.secret;
        if (!secret) return;
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        board.del(secret);
        const graveyard = player.child.graveyard;
        graveyard.add(secret);
    }
}