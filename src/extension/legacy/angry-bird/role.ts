import { MinionRoleModel } from "@/common/role/minion";
import { RoleModel } from "@/common/role";
import { AngryBirdEffectModel } from "./effect";
import { MinionRaceType } from "@/types/card";
import { FeatureModel } from "@/common/feature";

export class AngryBirdRoleModel extends MinionRoleModel {
    constructor(props: AngryBirdRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                races: [MinionRaceType.BEAST],
                ...props.state,
            },
            child: {
                ...props.child,
                effect: FeatureModel.assign(
                    props.child?.effect,
                    new AngryBirdEffectModel({})
                ),
            },
            refer: { ...props.refer },
        });
    }
}