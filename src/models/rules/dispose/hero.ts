import { Loader, Model } from "set-piece";
import { DisposeModel } from ".";
import { CardModel, HeroModel } from "../../..";

export namespace HeroDisposeProps {
    export type P = { hero: HeroModel; }
}

export class HeroDisposeModel extends DisposeModel<HeroDisposeProps.P> {

    constructor(loader?: Loader<HeroDisposeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { hero: HeroModel.prototype },
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