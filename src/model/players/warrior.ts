import { HeroModel } from "../hero";
import { WarriorSkillModel } from "../skills/warrior/skill";
import { RoleModel } from "../role";
import { HealthModel } from "../rules/health";
import { AttackModel } from "../rules/attack";
import { PlayerModel } from ".";

export class WarriorModel extends PlayerModel {
    constructor(props: WarriorModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                role: new RoleModel({
                    child: {
                        health: new HealthModel({state: { origin: 30 }}),
                        attack: new AttackModel({state: { origin: 0 }}),
                    },
                    refer: {},
                    state: {},
                }),
                skill: new WarriorSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}