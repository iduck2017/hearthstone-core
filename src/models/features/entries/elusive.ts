import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "..";
import { RoleFeatureModel } from "../role";

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
                isActive: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active(): boolean {
        if (this.state.isActive) return false;
        DebugUtil.log(`${this.route.role?.name} gain Elusive`);
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }
}