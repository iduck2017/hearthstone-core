import { DebugUtil, Model, TranxUtil } from "set-piece";
import { DisposeModel } from ".";
import { WeaponCardModel } from "../../..";

export class WeaponDisposeModel extends DisposeModel {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel);
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

    protected start() {
        const weapon = this.route.weapon;
        if (!weapon) return;
        DebugUtil.log(`${weapon.name} Break`);
        this.run();
        const deathrattle = weapon.child.deathrattle;
        deathrattle.forEach(item => item.start());
    }

    @TranxUtil.span()
    public run() {
        const weapon = this.route.weapon;
        if (!weapon) return;
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        hero.unequip(weapon);
        const graveyard = player.child.graveyard;
        graveyard.add(weapon);
    }
}