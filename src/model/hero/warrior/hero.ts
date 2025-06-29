import { HeroModel } from "../index";
import { WarriorRoleModel } from "./role";
import { WarriorSkillModel } from "./skill";

export class WarriorHeroModel extends HeroModel {
    constructor(props: WarriorHeroModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                name: 'Warrior',
                ...props.state,
            },
            child: {
                role: new WarriorRoleModel({}),
                skill: new WarriorSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}