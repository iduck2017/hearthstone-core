import { HeroCardModel } from "src/model/card/hero";
import { MageRoleModel } from "./role";
import { MageSkillModel } from "./skill";

export class MageCardModel extends HeroCardModel {
    constructor(props: MageCardModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                name: 'Mage',
                desc: '',
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