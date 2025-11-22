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
                isActived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active() {
        // before
        if (this.origin.state.isActived) return;
        const role = this.route.role;
        if (!role) return;

        // execute
        this.origin.state.isActived = true;
        // after
        DebugUtil.log(`${role.name} gain Taunt`);
        this.event.onActive(new Event({}));
    }

    public deactive() {
        const role = this.route.role;
        if (!role) return false;
        super.deactive();
    }
}