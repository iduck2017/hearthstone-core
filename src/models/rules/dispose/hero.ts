import { Model } from "set-piece";
import { DisposeModel } from ".";
import { AppModel, CardModel, HeroModel, PlayerModel } from "../../..";

export namespace HeroDisposeModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { 
        hero: HeroModel; 
        app: AppModel;
    };
}

export class HeroDisposeModel extends DisposeModel<
    HeroDisposeModel.E,
    HeroDisposeModel.S,
    HeroDisposeModel.C,
    HeroDisposeModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            hero: result.list.find(item => item instanceof HeroModel),
            player: result.list.find(item => item instanceof PlayerModel),
            app: result.list.find(item => item instanceof AppModel),
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

    public get status(): boolean {
        const hero = this.route.hero;
        if (!hero) return true;
        const role = hero.child.role;
        const health = role.child.health;
        if (health.state.current <= 0) return true;
        return false;
    }

    protected run() {
        const app = this.route.app;
        if (!app) return;
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        const isTie = opponent?.child.hero.child.dispose.status;
        if (isTie) console.log('tie');
        else console.log('player loss', player);
        app.end();
    }
}