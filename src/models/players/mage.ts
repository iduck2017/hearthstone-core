import { StoreUtil } from "set-piece";
import { PlayerModel } from ".";
import { HeroModel } from "../hero";
import { RoleModel } from "../role";
import { AttackModel } from "../rules/attack";
import { HealthModel } from "../rules/health";
import { MageSkillModel } from "../skills/mage/skill";

@StoreUtil.is('mage-model')
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
                    },
                    refer: {},
                    state: {}
                }),
                skill: new MageSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}