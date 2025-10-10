import { DebugUtil, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { WeaponCardModel } from "../../..";

export namespace WeaponDisposeModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { weapon: WeaponCardModel; };
}

export class WeaponDisposeModel extends DisposeModel<
    WeaponDisposeModel.E,
    WeaponDisposeModel.S,
    WeaponDisposeModel.C,
    WeaponDisposeModel.R
> {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.list.find(item => item instanceof WeaponCardModel);
        return {
            ...result,
            weapon,
        }
    }

    public get status(): boolean {
        const weapon = this.route.weapon;
        if (!weapon) return true;
        const action = weapon.child.action;
        if (action.state.current <= 0) return true;
        return super.status || false;
    }

    constructor(props?: WeaponDisposeModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected run() {
        const weapon = this.route.weapon;
        if (!weapon) return;
        this.doRemove();
        const feats = weapon.child.feats;
        const deathrattle = feats.child.deathrattle;
        for (const item of deathrattle) item.run();
    }

    @TranxUtil.span()
    public doRemove() {
        const weapon = this.route.weapon;
        if (!weapon) return;
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        board.del(weapon);
        const graveyard = player.child.graveyard;
        graveyard.add(weapon);
    }
}