import { Decor, Event, StateUtil, TemplUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "..";
import { SleepModel } from "../../rules/sleep";
import { RoleFeatureModel } from "../role";

export namespace RushModel {
    export type E = {};
    export type S = {}
    export type C = {};
    export type R = {};
}

@TemplUtil.is('rush')
export class RushModel extends RoleFeatureModel<
    RushModel.E,
    RushModel.S,
    RushModel.C,
    RushModel.R
> {
    constructor(props?: RushModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Rush',
                desc: 'Can attack minions immediately.',
                isActive: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }

}