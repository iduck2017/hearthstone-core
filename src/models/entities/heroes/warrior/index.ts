import { RoleHealthModel } from "../../../rules/role-health";
import { RoleAttackModel } from "../../../rules/role-attack";
import { PlayerModel } from "../../player";
import { ArmorUpModel } from "./skill";
import { HeroModel } from "..";
import { ChunkService } from "set-piece";

@ChunkService.is('warrior')
export class WarriorModel extends HeroModel {
    constructor(props?: WarriorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                health: new RoleHealthModel({ state: { origin: 30 }}),
                attack: new RoleAttackModel({ state: { origin: 0 }}),
                skill: props.child?.skill ?? new ArmorUpModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}