import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../../features/minion";

export namespace ElusiveModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('elusive')
export class ElusiveModel extends RoleFeatureModel<
    ElusiveModel.E,
    ElusiveModel.S,
    ElusiveModel.C,
    ElusiveModel.R
> {
    constructor(props?: ElusiveModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Elusive',
                desc: 'Can\'t be targeted by spells or Hero Powers.',
                isActived: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active() {
        // before
        if (this.origin.state.isActived) return;
        const role = this.route.role;
        if (!role) return false;

        // execute
        this.origin.state.isActived = true;
        
        // after
        DebugUtil.log(`${role.name} gain Elusive`);
        this.event.onActive(new Event({}));
    }
}