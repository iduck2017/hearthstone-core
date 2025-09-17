import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel, WeaponCardModel } from "../../..";
import { SecretCardModel } from "../../cards/secret";

export class SecretDisposeModel extends DisposeModel {

    constructor(loader?: Loader<SecretDisposeModel>) {
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

    protected run(): void {
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