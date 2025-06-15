import { SkillModel } from "@/common/skill";
import { Props } from "set-piece";

export class MageSkillModel extends SkillModel {
    constructor(props: Props<
        SkillModel.State,
        SkillModel.Child,
        SkillModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}