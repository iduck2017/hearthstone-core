import { Loader, Model } from "set-piece";
import { DisposeModel } from ".";
import { MinionModel } from "../../..";

export class MinionDisposeModel extends DisposeModel {
    public get route() {
        const route = super.route;
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        return {
            ...route,
            minion,
        }
    }

    constructor(loader?: Loader<MinionDisposeModel>) {
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

    protected check(): boolean {
        const minion = this.route.minion;
        if (!minion) return true;
        const role = minion.child.role;
        const health = role.child.health;
        if (health.state.current <= 0) return true;
        return false;
    }

    protected run(): void {
        const minion = this.route.minion;
        if (!minion) return;
        minion.dispose();
    }
}