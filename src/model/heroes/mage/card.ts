import { HeroCardModel } from "../../card/hero";
import { MageRoleModel } from "./role";
import { MageSkillModel } from "./skill";

export class MageCardModel extends HeroCardModel {
    constructor(props: MageCardModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                name: 'Mage',
                desc: '',
                armor: 0,
                mana: 0,
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