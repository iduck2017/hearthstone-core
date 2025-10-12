import { Event, TemplUtil } from "set-piece";
import { FeatureModel } from "..";
import { RoleFeatureModel } from "../role";

export namespace FrozenModel {
    export type E = {}
    export type S = {}
    export type C = {}
}

@TemplUtil.is('frozen')
export class FrozenModel extends RoleFeatureModel<
    FrozenModel.E,
    FrozenModel.S,
    FrozenModel.C
> {
    constructor(props?: FrozenModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Frozen',
                desc: 'Frozen charactoers lose their next attack.',
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