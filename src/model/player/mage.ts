import { PlayerModel } from ".";
import { HeroModel } from "../card/hero";
import { RoleModel } from "../role";
import { AttackModel } from "../role/attack";
import { HealthModel } from "../role/health";
import { MageSkillModel } from "../skill/mage/skill";

export class MageModel extends PlayerModel {
    constructor(props: MageModel['props']) {
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
                skill: new MageSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}