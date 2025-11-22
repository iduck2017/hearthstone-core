import { SkillModel } from "../../skill";
import { CostModel } from "../../../features/rules/cost";
import { TemplUtil } from "set-piece";
import { FireBlastEffectModel } from "./effect";

@TemplUtil.is('fireblast')
export class FireBlastModel extends SkillModel {
    constructor(props?: FireBlastModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Fireblast',
                desc: 'Deal 1 damage',
                ...props?.state,
            },
            child: {
                cost: props?.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props?.child?.effects ?? [new FireBlastEffectModel()],
                ...props?.child,
            },
            refer: { ...props?.refer },
        });
    }
}