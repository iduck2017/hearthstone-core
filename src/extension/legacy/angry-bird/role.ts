import { MinionRoleModel } from "@/common/role/minion";
import { RoleModel } from "@/common/role";
import { AngryBirdFeatureModel } from "./feature";

export class AngryBirdRoleModel extends MinionRoleModel {
    constructor(props: AngryBirdRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                ...props.state,
            },
            child: {
                features: [new AngryBirdFeatureModel({})],
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }
}