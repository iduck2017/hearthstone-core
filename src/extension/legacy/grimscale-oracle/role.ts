import { MinionRoleModel } from "@/common/role/minion";
import { MinionRaceType } from "@/types/card";
import { GrimscaleOracleEffectModel } from "./effect";
import { FeatureModel } from "@/common/feature";

export class GrimscaleOracleRoleModel extends MinionRoleModel {
    constructor(props: GrimscaleOracleRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                races: [MinionRaceType.MURLOC],
                ...props.state,
            },
            child: { 
                ...props.child,
                effect: FeatureModel.assign(
                    props.child?.effect,
                    new GrimscaleOracleEffectModel({})
                ),
            },
            refer: { ...props.refer }
        });
    }
}