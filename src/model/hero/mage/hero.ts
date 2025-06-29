import { HeroModel } from "../index";
import { MageRoleModel } from "./role";
import { MageSkillModel } from "./skill";

export class MageHeroModel extends HeroModel {
    constructor(props: MageHeroModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                name: 'Mage',
                ...props.state,
            },
            child: {
                role: new MageRoleModel({}),
                skill: new MageSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}