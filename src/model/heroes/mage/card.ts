import { HeroCardModel } from "../../card/hero";
import { HeroModel } from "../../hero";
import { MageRoleModel } from "./role";
import { MageSkillModel } from "./skill";

export class MageModel extends HeroModel {
    constructor(props: MageModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                role: new MageRoleModel({}),
                skill: new MageSkillModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}