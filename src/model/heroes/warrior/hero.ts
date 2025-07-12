import { HeroCardModel } from "../../card/hero";
import { WarriorRoleModel } from "./role";
import { WarriorSkillModel } from "./skill";

export class WarriorModel extends HeroCardModel {
    constructor(props: WarriorModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                name: 'Warrior',
                desc: "",
                mana: 0,
                armor: 0,
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