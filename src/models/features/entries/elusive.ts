import { DebugService, Event, ChunkService } from "set-piece";
import { FeatureModel } from "../../features";
import { RoleFeatureModel } from "../role";

export namespace ElusiveModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@ChunkService.is('elusive')
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
                isEnabled: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }
}