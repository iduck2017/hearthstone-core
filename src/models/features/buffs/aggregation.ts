import { FeatureModel } from "..";
import { RoleAttackBuffModel } from "./role-attack";
import { RoleHealthBuffModel } from "./role-health";
import { WeaponActionkBuffModel } from "./weapon-action";
import { WeaponAttackBuffModel } from "./weapon-attack";

export namespace BuffAggregationModel {
    export type S = {}
    export type C = {
        readonly items: BuffModel[]
    }
    export type E = {};
    export type R = {};
}

export type BuffModel = 
    RoleAttackBuffModel |
    RoleHealthBuffModel | 
    WeaponAttackBuffModel | 
    WeaponActionkBuffModel

export class BuffAggregationModel<
    E extends Partial<BuffAggregationModel.E & FeatureModel.E> = {},
    S extends Partial<BuffAggregationModel.S & FeatureModel.S> = {},
    C extends Partial<BuffAggregationModel.C & FeatureModel.C> = {},
    R extends Partial<BuffAggregationModel.R & FeatureModel.R> = {}
> extends FeatureModel<
    E & BuffAggregationModel.E,
    S & BuffAggregationModel.S,
    C & BuffAggregationModel.C,
    R & BuffAggregationModel.R
> {
    constructor(props: BuffAggregationModel['props'] & {
        uuid: string | undefined;
        state: S & BuffAggregationModel.S & Pick<FeatureModel.S, 'desc' | 'name'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isEnabled: true,
                ...props.state 
            },
            child: { 
                items: [],
                ...props.child 
            },
            refer: { ...props.refer } 
        });
    }
}