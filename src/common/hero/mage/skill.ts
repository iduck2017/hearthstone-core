import { SkillModel } from "@/common/skill";

export class MageSkillModel extends SkillModel {
    constructor(props: MageSkillModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}