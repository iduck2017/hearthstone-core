import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "..";
import { MinionFeatureModel } from "../minion";

export namespace TauntModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@TemplUtil.is('taunt')
export class TauntModel extends MinionFeatureModel<
    TauntModel.E, 
    TauntModel.S, 
    TauntModel.C, 
    TauntModel.R
> {
    constructor(props?: TauntModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: {
                name: 'Taunt',
                desc: 'Enemies must attack this minion.',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Taunt`);
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }

    public deactive() {
        const role = this.route.role;
        if (!role) return false;
        super.deactive();
    }
}