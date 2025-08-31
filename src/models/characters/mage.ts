import { StoreUtil } from "set-piece";
import { RoleModel } from "../role";
import { AttackModel } from "../rules/attack";
import { HealthModel } from "../rules/health";
import { FireBlastModel } from "../skills/fireblast";
import { CharacterModel } from ".";

@StoreUtil.is('mage')
export class MageModel extends CharacterModel {
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
                skill: new FireBlastModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}