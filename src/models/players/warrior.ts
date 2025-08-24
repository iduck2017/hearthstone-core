import { HeroModel } from "../hero";
import { RoleModel } from "../role";
import { HealthModel } from "../rules/health";
import { AttackModel } from "../rules/attack";
import { PlayerModel } from ".";
import { ArmorUpModel } from "../skills/armor-up";
import { StoreUtil } from "set-piece";

@StoreUtil.is('warrior')
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
                skill: new ArmorUpModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}