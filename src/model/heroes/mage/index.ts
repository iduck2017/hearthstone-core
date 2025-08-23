import { HeroCardModel } from "../../card/hero";
import { HeroModel } from "..";
import { MageSkillModel } from "./skill";
import { RoleModel } from "../../role";
import { AttackModel } from "../../role/attack";
import { HealthModel } from "../../role/health";

export class MageModel extends HeroModel {
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