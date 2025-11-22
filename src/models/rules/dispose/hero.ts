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

    protected get isActived(): boolean {
        const hero = this.route.hero;
        if (!hero) return true;
        if (hero.child.health.state.current <= 0) return true;
        return false;
    }

    protected run() {
        const app = this.route.app;
        if (!app) return;
        
        const player = this.route.player;
        if (!player) return;
        DebugUtil.log(`${player.name} Die`);

        app.del();
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const dispose = opponent.child.hero.child.dispose;
        if (dispose.state.isActived) DebugUtil.log('Tie!');
        else DebugUtil.log(`${opponent.name} Win!`);
        
    }
}