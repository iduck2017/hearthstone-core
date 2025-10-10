import { Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../rules/feature";

export namespace ElusiveModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = {}
}

@TemplUtil.is('elusive')
export class ElusiveModel extends FeatureModel<
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
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
        return true;
    }
}