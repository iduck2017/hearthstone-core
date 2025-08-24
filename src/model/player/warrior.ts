import { HeroModel } from "../card/hero";
import { WarriorSkillModel } from "../skill/warrior/skill";
import { RoleModel } from "../role";
import { HealthModel } from "../role/health";
import { AttackModel } from "../role/attack";
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