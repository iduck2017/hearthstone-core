import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel, WeaponCardModel } from "../../..";
import { SecretCardModel } from "../../cards/secret";

export namespace SecretDisposeProps {
    export type P = { secret: SecretCardModel; }
}

export class SecretDisposeModel extends DisposeModel<SecretDisposeProps.P> {

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

    protected check(): boolean { return false; }

    protected run(): void {
        const secret = this.route.secret;
        if (!secret) return;
        this.doRemove();
    }

    @TranxUtil.span()
    public doRemove() {
    }
}