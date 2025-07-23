import { HeroCardModel } from "../../card/hero";
import { HeroModel } from "../../hero";
import { WarriorRoleModel } from "./role";
import { WarriorSkillModel } from "./skill";

export class WarriorModel extends HeroModel {
    constructor(props: WarriorModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                role: new WarriorRoleModel({}),
                skill: new WarriorSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}