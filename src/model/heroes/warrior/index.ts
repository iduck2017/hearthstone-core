import { HeroCardModel } from "../../card/hero";
import { HeroModel } from "..";
import { WarriorSkillModel } from "./skill";
import { RoleModel } from "../../role";
import { HealthModel } from "../../role/health";
import { AttackModel } from "../../role/attack";

export class WarriorModel extends HeroModel {
    constructor(props: WarriorModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                role: new RoleModel({
                    child: {
                        health: new HealthModel({state: { origin: 30 }}),
                        attack: new AttackModel({state: { origin: 0 }}),
                    }
                }),
                skill: new WarriorSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}