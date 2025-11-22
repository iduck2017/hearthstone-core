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

    protected get isActived(): boolean {
        const weapon = this.route.weapon;
        if (!weapon) return true;
        if (weapon.child.action.state.current <= 0) return true;
        return false;
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
        // before
        const weapon = this.route.weapon;
        if (!weapon) return;

        // execute
        this.doRun();
        
        // after
        DebugUtil.log(`${weapon.name} Break`);
        const deathrattle = weapon.child.deathrattle;
        deathrattle.forEach(item => item.run());
    }

    @TranxUtil.span()
    protected doRun() {
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