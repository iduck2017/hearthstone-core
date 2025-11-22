import { RoleAttackModel } from "../../../features/rules/role-attack";
import { RoleHealthModel } from "../../../features/rules/role-health";
import { FireBlastModel } from "./skill";
import { HeroModel } from "..";
import { TemplUtil } from "set-piece";

@TemplUtil.is('mage')
export class MageModel extends HeroModel {
    constructor(props?: MageModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 30 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 0 }}),
                skill: props.child?.skill ?? new FireBlastModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}