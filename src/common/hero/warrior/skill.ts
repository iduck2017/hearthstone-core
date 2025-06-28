import { SkillModel } from "@/common/skill";

export class WarriorSkillModel extends SkillModel {
    constructor(props: WarriorSkillModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}