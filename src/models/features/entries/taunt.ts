import { DebugUtil, Event, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../role";

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
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}