import { MinionRoleModel } from "@/common/role/minion";
import { RoleModel } from "@/common/role";
import { AngryBirdEffectModel } from "./effect";

export class AngryBirdRoleModel extends MinionRoleModel {
    constructor(props: AngryBirdRoleModel['props']) {
        const effect = props.child?.effect ?? [];
        if (!effect.find(item => item instanceof AngryBirdEffectModel)) {
            effect.push(new AngryBirdEffectModel({}));
        }
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                ...props.state,
            },
            child: {
                ...props.child,
                effect,
            },
            refer: { ...props.refer },
        });
    }
}