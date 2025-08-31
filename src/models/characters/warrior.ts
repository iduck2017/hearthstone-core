import { RoleModel } from "../role";
import { HealthModel } from "../rules/health";
import { AttackModel } from "../rules/attack";
import { PlayerModel } from "../player";
import { ArmorUpModel } from "../skills/armor-up";
import { StoreUtil } from "set-piece";
import { CharacterModel } from ".";

@StoreUtil.is('warrior')
export class WarriorModel extends CharacterModel {
    constructor(props: WarriorModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                role: props.child?.role ?? new RoleModel({
                    child: {
                        health: new HealthModel({state: { origin: 30 }}),
                        attack: new AttackModel({state: { origin: 0 }}),
                    },
                    refer: {},
                    state: {},
                }),
                skill: props.child?.skill ?? new ArmorUpModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}