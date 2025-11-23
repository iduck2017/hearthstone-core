import { StateUtil } from "set-piece";
import { WeaponAttackModel } from "../../rules/weapon-attack";
import { WeaponAttackDecor } from "../../../types/decors/weapon-attack";
import { OperatorType } from "../../../types/operator";
import { BuffModel } from ".";

export namespace WeaponAttackBuffModel {
    export type S = {};
    export type E = {};
    export type C = {};
    export type R = {};
}

export class WeaponAttackBuffModel extends BuffModel<
    WeaponAttackBuffModel.E,
    WeaponAttackBuffModel.S,
    WeaponAttackBuffModel.C,
    WeaponAttackBuffModel.R
> {
    constructor(props: WeaponAttackBuffModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    
    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        const weapon = this.route.weapon;
        return weapon?.proxy.child.attack?.decor;
    }
    protected modifyAttack(that: WeaponAttackModel, decor: WeaponAttackDecor) {
        if (!this.state.isEnabled) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset,
            reason: this,
        });
    }
}