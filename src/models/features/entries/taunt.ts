import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../../features/minion";

export namespace TauntModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@TemplUtil.is('taunt')
export class TauntModel extends RoleFeatureModel<
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
                actived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active(): boolean {
        if (this.state.actived) return false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Taunt`);
        this.origin.state.actived = true;
        this.event.onEnable(new Event({}));
        return true;
    }

    public disable() {
        const role = this.route.role;
        if (!role) return false;
        super.disable();
    }
}