import { DebugUtil, Model } from "set-piece";
import { DisposeModel } from ".";
import { AppModel, CardModel, HeroModel, PlayerModel } from "../../..";

export class HeroDisposeModel extends DisposeModel {
    public get route() {
        const result = super.route;
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        return {
            ...result,
            hero,
            player: result.items.find(item => item instanceof PlayerModel),
            app: result.items.find(item => item instanceof AppModel),
        }
    }

    constructor(props?: HeroDisposeModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get isDisposable(): boolean {
        const hero = this.route.hero;
        if (!hero) return true;

        const health = hero.child.health;
        if (health.state.current <= 0) return true;
        return false;
    }

    protected run() {
        const app = this.route.app;
        if (!app) return;
        
        const player = this.route.player;
        if (!player) return;
        DebugUtil.log(`${player.name} Die`);

        const opponent = player.refer.opponent;
        const dispose = opponent?.child.hero.child.dispose;
        if (!dispose?.isDisposable) DebugUtil.log(`${opponent?.name} Win!`);
        app.del();
    }
}