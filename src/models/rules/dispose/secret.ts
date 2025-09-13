import { DebugUtil, Loader, LogLevel, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { MinionCardModel, PlayerModel, WeaponCardModel } from "../../..";
import { SecretCardModel } from "../../cards/secret";

export class SecretDisposeModel extends DisposeModel {
    public get route() {
        const route = super.route;
        const secret: SecretCardModel | undefined = route.order.find(item => item instanceof SecretCardModel);
        return {
            ...route,
            secret,
            player: route.order.find(item => item instanceof PlayerModel)
        }
    }

    constructor(loader?: Loader<SecretDisposeModel>) {
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