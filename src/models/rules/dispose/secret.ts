import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel, WeaponCardModel } from "../../..";
import { SecretCardModel } from "../../cards/secret";

export namespace SecretDisposeProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { secret: SecretCardModel; };
}

export class SecretDisposeModel extends DisposeModel<
    SecretDisposeProps.E,
    SecretDisposeProps.S,
    SecretDisposeProps.C,
    SecretDisposeProps.R,
    SecretDisposeProps.P
> {

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