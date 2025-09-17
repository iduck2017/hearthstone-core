import { Loader, Model } from "set-piece";
import { DisposeModel } from ".";
import { CardModel, HeroModel } from "../../..";

export namespace HeroDisposeProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { hero: HeroModel; };
}

export class HeroDisposeModel extends DisposeModel<
    HeroDisposeProps.E,
    HeroDisposeProps.S,
    HeroDisposeProps.C,
    HeroDisposeProps.R,
    HeroDisposeProps.P
> {
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

    protected run() {}
}