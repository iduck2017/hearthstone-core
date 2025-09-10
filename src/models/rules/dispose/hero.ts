import { Loader, Model } from "set-piece";
import { DisposeModel } from ".";
import { CardModel, HeroModel } from "../../..";

export class HeroDisposeModel extends DisposeModel {
    public get route() {
        const route = super.route;
        const hero: HeroModel | undefined = route.order.find(item => item instanceof HeroModel)
        return {
            ...route,
            hero,
        }
    }

    constructor(loader?: Loader<HeroDisposeModel>) {
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
        const hero = this.route.hero;
        if (!hero) return true;
        const role = hero.child.role;
        const health = role.child.health;
        if (health.state.current <= 0) return true;
        return false;
    }

    protected run(): void {
    }
}