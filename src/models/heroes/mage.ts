import { RoleModel } from "../role";
import { RoleAttackModel } from "../rules/role/attack";
import { RoleHealthModel } from "../rules/role/health";
import { FireBlastModel } from "../skills/fireblast";
import { HeroModel } from ".";
import { TemplUtil } from "set-piece";

@TemplUtil.is('mage')
export class MageModel extends HeroModel {
    constructor(props?: MageModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                role: props.child?.role ?? new RoleModel({ 
                    child: {
                        health: new RoleHealthModel({ state: { origin: 30 }}),
                        attack: new RoleAttackModel({ state: { origin: 0 }}),
                    },
                }),
                skill: props.child?.skill ?? new FireBlastModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}