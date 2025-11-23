import { FeatureModel } from "..";
import { StateUtil } from "set-piece";
import { OperatorType } from "../../../types/operator";
import { WeaponActionModel } from "../../rules/weapon-action";
import { WeaponActionDecor } from "../../../types/decors/weapon-action";
import { BuffModel } from ".";

export namespace WeaponActionkBuffModel {
    export type S = {};
    export type E = {};
    export type C = {};
    export type R = {};
}

export class WeaponActionkBuffModel extends BuffModel<
    WeaponActionkBuffModel.E,
    WeaponActionkBuffModel.S,
    WeaponActionkBuffModel.C,
    WeaponActionkBuffModel.R
> {
    constructor(props?: WeaponActionkBuffModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    @StateUtil.on(self => self.modifyAction)
    private listenAction() {
        const weapon = this.route.weapon;
        return weapon?.proxy.child.action?.decor;
    }
    protected modifyAction(that: WeaponActionModel, decor: WeaponActionDecor) {
        if (!this.state.isEnabled) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset,
            reason: this,
        });
    }
}