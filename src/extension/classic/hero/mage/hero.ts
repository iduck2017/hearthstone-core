import { HeroModel } from "@/common/hero";
import { MageRoleModel } from "./role";
import { Props } from "set-piece";
import { MageSkillModel } from "./skill";

export class MageHeroModel extends HeroModel {
    constructor(props: Props<
        HeroModel.State,
        HeroModel.Child,
        HeroModel.Refer
    >) {
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